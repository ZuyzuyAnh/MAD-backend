import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import NotfoundException from '../exception/notfound.exception';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createProgressDto: CreateProgressDto) {
    const progress = this.progressRepository.create(createProgressDto);

    return await this.progressRepository.save(progress);
  }

  async findAll(
    paginateDto?: PaginateDto,
    userId?: number,
    languageId?: number,
  ) {
    const queryBuilder = this.progressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.user', 'user')
      .leftJoinAndSelect('progress.language', 'language');

    if (userId) {
      queryBuilder.andWhere('progress.userId = :userId', { userId });
    }

    if (languageId) {
      queryBuilder.andWhere('progress.languageId = :languageId', {
        languageId,
      });
    }

    if (paginateDto) {
      const { page, limit } = paginateDto;
      const total = await queryBuilder.getCount();

      const results = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('progress.updatedAt', 'DESC')
        .getMany();

      const totalPages = Math.ceil(total / limit);

      return {
        data: results,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['user', 'language'],
    });

    if (!progress) {
      throw new NotfoundException('progress', 'id', id);
    }

    return progress;
  }

  async findByUserAndLanguage(userId: number, languageId: number) {
    const progress = await this.progressRepository.findOneBy({
      userId,
      languageId,
    });

    if (!progress) {
      throw new NotfoundException(
        'progress',
        'userId and languageId',
        `${userId}, ${languageId}`,
      );
    }

    return progress;
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    const progress = await this.findOne(id);

    Object.assign(progress, updateProgressDto);

    return this.progressRepository.save(progress);
  }

  async updateStreak(userId: number, languageId: number) {
    try {
      const progress = await this.findByUserAndLanguage(userId, languageId);

      const lastActivity = progress.lastActivity
        ? new Date(progress.lastActivity)
        : null;
      const today = new Date();

      if (
        !lastActivity ||
        today.getDate() !== lastActivity.getDate() ||
        today.getMonth() !== lastActivity.getMonth() ||
        today.getFullYear() !== lastActivity.getFullYear()
      ) {
        if (
          lastActivity &&
          Math.floor(
            (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
          ) > 1
        ) {
          progress.currentStreak = 1;
        } else {
          progress.currentStreak += 1;
        }

        progress.lastActivity = today;
        return this.progressRepository.save(progress);
      }

      return progress;
    } catch (error) {
      if (error instanceof NotfoundException) {
        return this.create(userId, {
          languageId,
          currentStreak: 1,
          lastActivity: new Date(),
        });
      }
      throw error;
    }
  }

  async remove(id: number) {
    const progress = await this.findOne(id);
    return this.progressRepository.remove(progress);
  }
}
