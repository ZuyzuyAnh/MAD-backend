/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/user_session/user_session.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { UserSession } from './entities/user_session.entity';
import { CreateUserSessionDto } from './dto/create-user_session.dto';
import { UpdateUserSessionDto } from './dto/update-user_session.dto';
import {
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isSameDay,
  subDays,
  DateArg,
  format,
  subWeeks,
  subMonths,
  differenceInMinutes,
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { SessionStatisticItem } from './dto/session-statistic-item.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async create(createUserSessionDto: CreateUserSessionDto) {
    const userSession = this.userSessionRepository.create({
      user: { id: createUserSessionDto.userId },
      loginTime: new Date(),
    });
    return this.userSessionRepository.save(userSession);
  }

  async updateLogoutTime(sessionId: number) {
    const session = await this.userSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (session) {
      session.logoutTime = new Date();
      return this.userSessionRepository.save(session);
    }
  }

  async getStudyTimeByLastSevenDays(userId: number) {
    const today = new Date();
    const result: SessionStatisticItem[] = [];

    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = endOfDay(date);

      const studyTime = await this.calculateStudyTime(userId, start, end);

      result.push({
        dayOrMonth: format(date, 'E', { locale: vi }),
        totalTime: studyTime.hours,
      });
    }

    return result.reverse();
  }

  async getStudyTimeByLastFourWeeks(userId: number) {
    const today = new Date();
    const result: SessionStatisticItem[] = [];

    for (let i = 0; i < 4; i++) {
      const currentWeekDate = subWeeks(today, i);
      const start = startOfWeek(currentWeekDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentWeekDate, { weekStartsOn: 1 });

      const studyTime = await this.calculateStudyTime(userId, start, end);

      result.push({
        dayOrMonth: `${4 - i}`,
        totalTime: studyTime.hours,
      });
    }

    return result.reverse();
  }

  async getStudyTimeByLastFourMonths(userId: number) {
    const today = new Date();
    const result: SessionStatisticItem[] = [];

    for (let i = 0; i < 4; i++) {
      const currentMonthDate = subMonths(today, i);
      const start = startOfMonth(currentMonthDate);
      const end = endOfMonth(currentMonthDate);

      const studyTime = await this.calculateStudyTime(userId, start, end);

      result.push({
        dayOrMonth: format(currentMonthDate, 'MMM', { locale: vi }),
        totalTime: studyTime.hours,
      });
    }

    return result.reverse();
  }

  private async calculateStudyTime(
    userId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const sessions = await this.userSessionRepository.find({
      where: {
        user: { id: userId },
        loginTime: Between(startDate, endDate),
      },
    });

    let totalMinutes = 0;

    for (const session of sessions) {
      const endTime = session.logoutTime || new Date();
      const duration =
        (endTime.getTime() - session.loginTime.getTime()) / (1000 * 60);
      totalMinutes += duration;
    }

    return {
      minutes: Math.floor(totalMinutes),
      hours: Math.floor(totalMinutes / 60),
      sessions: sessions.length,
    };
  }

  async getLoginStreak(userId: number) {
    const loginDates = await this.userSessionRepository
      .createQueryBuilder('session')
      .select('DATE(session.login_time)', 'loginDate')
      .where('session.user_id = :userId', { userId })
      .groupBy('loginDate')
      .orderBy('loginDate', 'DESC')
      .getRawMany();

    if (loginDates.length === 0) {
      return {
        currentStreak: 0,
        streakDates: [],
      };
    }

    const dates = loginDates.map((record) => {
      const date = new Date(record.loginDate);
      return {
        date: startOfDay(date),
        formatted: format(date, 'yyyy-MM-dd'),
      };
    });

    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    const loggedInTodayOrYesterday = dates.some(
      (d) =>
        d.date.getTime() === today.getTime() ||
        d.date.getTime() === yesterday.getTime(),
    );

    if (!loggedInTodayOrYesterday) {
      return {
        currentStreak: 0,
        streakDates: [],
      };
    }

    let currentStreak = 1;
    let previousDate = dates[0].date;
    const streakDates = [dates[0].formatted];

    for (let i = 1; i < dates.length; i++) {
      const expectedPreviousDay = subDays(previousDate, 1);

      if (dates[i].date.getTime() === expectedPreviousDay.getTime()) {
        currentStreak++;
        streakDates.push(dates[i].formatted);
        previousDate = dates[i].date;
      } else {
        break;
      }
    }

    return {
      currentStreak,
      streakDates,
    };
  }

  async getTotalStudyTime(userId: number) {
    const sessions = await this.userSessionRepository.find({
      where: { user: { id: userId } },
    });

    let totalMinutes = 0;

    for (const session of sessions) {
      const endTime = session.logoutTime || new Date();
      const duration = differenceInMinutes(endTime, session.loginTime);
      totalMinutes += duration;
    }

    return totalMinutes / 60;
  }

  async findAllUserSessions(userId: number) {
    return this.userSessionRepository.find({
      where: { user: { id: userId } },
      order: { loginTime: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.userSessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(id: number, updateUserSessionDto: UpdateUserSessionDto) {
    await this.userSessionRepository.update(id, updateUserSessionDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const session = await this.findOne(id);
    if (session) {
      await this.userSessionRepository.remove(session);
      return true;
    }
    return false;
  }
}
