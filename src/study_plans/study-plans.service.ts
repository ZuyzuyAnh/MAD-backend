import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan, StudyTimeSlot } from './entities/study-plan.entity';
import { CreateStudyPlanDto } from './dto/create-study-plan.dto';
import { UpdateStudyPlanDto } from './dto/update-study-plan.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMonths, differenceInDays, differenceInMonths } from 'date-fns';
import EntityNotFoundException from '../exception/notfound.exception';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class StudyPlansService {
  private readonly logger = new Logger(StudyPlansService.name);

  constructor(
    @InjectRepository(StudyPlan)
    private studyPlanRepository: Repository<StudyPlan>,
    private notificationsService: NotificationsService,
  ) {}

  async create(
    userId: number,
    createStudyPlanDto: CreateStudyPlanDto,
  ): Promise<StudyPlan> {
    // Kiểm tra xem user đã có study plan chưa
    const existingPlan = await this.studyPlanRepository.findOne({
      where: { userId },
    });

    // Nếu có rồi thì cập nhật
    if (existingPlan) {
      return this.update(existingPlan.id, createStudyPlanDto);
    }

    // Nếu chưa có thì tạo mới
    const startDate = new Date();
    const targetCompletionDate = addMonths(
      startDate,
      createStudyPlanDto.completionTimeMonths,
    );

    const studyPlan = this.studyPlanRepository.create({
      userId,
      ...createStudyPlanDto,
      startDate,
      targetCompletionDate,
    });

    // Lưu study plan
    const savedPlan = await this.studyPlanRepository.save(studyPlan);

    // Tạo thông báo chào mừng
    await this.notificationsService.createSystemNotification(
      'Kế hoạch học tập đã được thiết lập',
      `Bạn đã thiết lập kế hoạch học tập với mục tiêu hoàn thành trong ${createStudyPlanDto.completionTimeMonths} tháng.`,
      { studyPlanId: savedPlan.id },
      userId,
    );

    return savedPlan;
  }

  async findByUserId(userId: number): Promise<StudyPlan> {
    const studyPlan = await this.studyPlanRepository.findOne({
      where: { userId },
    });

    if (!studyPlan) {
      throw new EntityNotFoundException('Kế hoạch học tập', 'userId', userId);
    }

    return studyPlan;
  }

  async findOne(id: number): Promise<StudyPlan> {
    const studyPlan = await this.studyPlanRepository.findOne({
      where: { id },
    });

    if (!studyPlan) {
      throw new EntityNotFoundException('Kế hoạch học tập', 'id', id);
    }

    return studyPlan;
  }

  async update(
    id: number,
    updateStudyPlanDto: UpdateStudyPlanDto,
  ): Promise<StudyPlan> {
    const studyPlan = await this.findOne(id);

    // Cập nhật thông tin
    Object.assign(studyPlan, updateStudyPlanDto);

    // Nếu thời gian hoàn thành thay đổi, cần tính lại ngày hoàn thành
    if (updateStudyPlanDto.completionTimeMonths) {
      // Tính khoảng thời gian đã trôi qua từ ngày bắt đầu
      const elapsedDays = differenceInDays(new Date(), studyPlan.startDate);

      // Nếu đã quá thời gian từ ngày bắt đầu, thì lấy hôm nay làm ngày bắt đầu mới
      if (
        elapsedDays < 0 ||
        elapsedDays > updateStudyPlanDto.completionTimeMonths * 30
      ) {
        studyPlan.startDate = new Date();
      }

      // Tính lại ngày hoàn thành dựa trên ngày bắt đầu và thời gian hoàn thành mới
      studyPlan.targetCompletionDate = addMonths(
        studyPlan.startDate,
        updateStudyPlanDto.completionTimeMonths,
      );
    }

    // Lưu cập nhật
    const updatedPlan = await this.studyPlanRepository.save(studyPlan);

    // Gửi thông báo về việc cập nhật kế hoạch
    await this.notificationsService.createSystemNotification(
      'Kế hoạch học tập đã được cập nhật',
      `Bạn đã cập nhật kế hoạch học tập với mục tiêu hoàn thành trong ${updatedPlan.completionTimeMonths} tháng.`,
      { studyPlanId: updatedPlan.id },
      updatedPlan.userId,
    );

    return updatedPlan;
  }

  async remove(id: number): Promise<void> {
    const studyPlan = await this.findOne(id);
    await this.studyPlanRepository.remove(studyPlan);

    // Gửi thông báo về việc xóa kế hoạch
    await this.notificationsService.createSystemNotification(
      'Kế hoạch học tập đã bị xóa',
      'Bạn đã xóa kế hoạch học tập của mình. Bạn có thể tạo kế hoạch mới bất cứ lúc nào.',
      { action: 'study_plan_deleted' },
      studyPlan.userId,
    );
  }

  // Hàm tạo thông báo định kỳ hàng ngày
  @Cron(CronExpression.EVERY_HOUR)
  async sendStudyReminderNotifications() {
    this.logger.log('Đang kiểm tra thông báo học tập theo giờ...');

    const now = new Date();
    const studyPlans = await this.studyPlanRepository.find();

    for (const plan of studyPlans) {
      // Kiểm tra xem thời gian hiện tại có trong khung giờ học tập của user không
      if (this.isWithinStudyTimeSlot(plan, now)) {
        // Kiểm tra xem hôm nay đã gửi thông báo chưa
        if (!this.hasNotifiedToday(plan, now)) {
          this.logger.log(
            `Gửi thông báo nhắc nhở học tập cho user ${plan.userId}`,
          );

          // Gửi thông báo nhắc nhở học tập
          await this.notificationsService.create(
            {
              title: 'Nhắc nhở học tập',
              content:
                'Đã đến giờ học tập của bạn! Hãy dành thời gian để thực hành và hoàn thành bài học hôm nay.',
              type: NotificationType.REMINDER,
              data: { type: 'daily_reminder', studyPlanId: plan.id },
            },
            plan.userId,
          );

          // Cập nhật ngày thông báo gần nhất
          plan.lastNotificationDate = now;
          await this.studyPlanRepository.save(plan);
        }
      }
    }
  }

  // Hàm kiểm tra mốc thời gian quan trọng - chạy vào 9h sáng mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkMilestones() {
    this.logger.log('Đang kiểm tra các mốc thời gian học tập quan trọng...');

    const today = new Date();
    const studyPlans = await this.studyPlanRepository.find();

    for (const plan of studyPlans) {
      try {
        // Kiểm tra các mốc thời gian
        const startDate = new Date(plan.startDate);
        const targetDate = new Date(plan.targetCompletionDate);

        // Tính tổng số ngày và số ngày còn lại
        const totalDays = Math.round(
          (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        const daysLeft = Math.round(
          (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Kiểm tra nếu đã hoàn thành kế hoạch
        if (daysLeft <= 0) {
          await this.notificationsService.create(
            {
              title: 'Kế hoạch học tập đã kết thúc',
              content:
                'Kế hoạch học tập của bạn đã kết thúc. Hãy đánh giá kết quả và thiết lập mục tiêu mới!',
              type: NotificationType.ACHIEVEMENT,
              data: { type: 'plan_completed', studyPlanId: plan.id },
            },
            plan.userId,
          );
          continue;
        }

        // Kiểm tra các mốc quan trọng dựa trên số tháng đã chọn
        switch (plan.completionTimeMonths) {
          case 1: // Kế hoạch 1 tháng
            // Kiểm tra mốc còn 1 tuần
            if (daysLeft === 7) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn chỉ còn 1 tuần để hoàn thành mục tiêu học tập!',
                '1_week_left',
              );
            }
            // Kiểm tra mốc còn 3 ngày
            else if (daysLeft === 3) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn chỉ còn 3 ngày để hoàn thành mục tiêu học tập!',
                '3_days_left',
              );
            }
            break;

          case 3: // Kế hoạch 3 tháng
            // Kiểm tra mốc hoàn thành 1 tháng đầu tiên
            if (daysLeft === Math.round((totalDays * 2) / 3)) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn đã hoàn thành 1 tháng học tập. Còn 2 tháng nữa để đạt mục tiêu!',
                '1_month_done',
              );
            }
            // Kiểm tra mốc hoàn thành 2 tháng
            else if (daysLeft === Math.round((totalDays * 1) / 3)) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn đã hoàn thành 2 tháng học tập. Chỉ còn 1 tháng nữa!',
                '2_months_done',
              );
            }
            // Kiểm tra mốc còn 1 tuần
            else if (daysLeft === 7) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn chỉ còn 1 tuần để hoàn thành mục tiêu học tập!',
                '1_week_left',
              );
            }
            break;

          case 6: // Kế hoạch 6 tháng
            // Kiểm tra các mốc hoàn thành từng tháng
            const monthsPassed = differenceInMonths(today, startDate);
            const monthsTotal = plan.completionTimeMonths;
            const monthsLeft = monthsTotal - monthsPassed;

            if (
              monthsPassed > 0 &&
              monthsPassed < monthsTotal &&
              monthsLeft > 0
            ) {
              // Kiểm tra nếu vừa qua 1 tháng mới (ngày đầu tiên của tháng mới)
              const isFirstDayOfNewMonth =
                today.getDate() === 1 ||
                differenceInDays(
                  today,
                  addMonths(startDate, monthsPassed - 1),
                ) <= 2;

              if (isFirstDayOfNewMonth) {
                await this.sendMilestoneNotification(
                  plan,
                  `Bạn đã hoàn thành ${monthsPassed} tháng học tập. Còn ${monthsLeft} tháng nữa để đạt mục tiêu!`,
                  `${monthsPassed}_months_done`,
                );
              }
            }

            // Kiểm tra mốc còn 1 tháng
            if (monthsLeft === 1 && daysLeft <= 31 && daysLeft >= 28) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn chỉ còn 1 tháng để hoàn thành mục tiêu học tập!',
                '1_month_left',
              );
            }
            // Kiểm tra mốc còn 1 tuần
            else if (daysLeft === 7) {
              await this.sendMilestoneNotification(
                plan,
                'Bạn chỉ còn 1 tuần để hoàn thành mục tiêu học tập!',
                '1_week_left',
              );
            }
            break;
        }
      } catch (error) {
        this.logger.error(
          `Lỗi khi kiểm tra mốc thời gian cho plan ${plan.id}: ${error.message}`,
        );
      }
    }
  }

  // Gửi thông báo mốc thời gian
  private async sendMilestoneNotification(
    plan: StudyPlan,
    message: string,
    milestone: string,
  ): Promise<void> {
    try {
      await this.notificationsService.create(
        {
          title: 'Mốc học tập quan trọng',
          content: message,
          type: NotificationType.REMINDER,
          data: { type: 'milestone', studyPlanId: plan.id, milestone },
        },
        plan.userId,
      );
      this.logger.log(
        `Đã gửi thông báo mốc ${milestone} cho user ${plan.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Lỗi khi gửi thông báo mốc ${milestone} cho user ${plan.userId}: ${error.message}`,
      );
    }
  }

  // Kiểm tra xem thời gian hiện tại có nằm trong khung giờ học tập không
  private isWithinStudyTimeSlot(plan: StudyPlan, date: Date): boolean {
    // Thời gian hiện tại
    const hour = date.getHours();

    // Kiểm tra khung giờ
    switch (plan.studyTimeSlot) {
      case StudyTimeSlot.MORNING:
        // Khung giờ 6-9h
        return hour >= 6 && hour < 9;
      case StudyTimeSlot.WORK_HOURS:
        // Khung giờ 7-8h hoặc 17-18h
        return (hour >= 7 && hour < 8) || (hour >= 17 && hour < 18);
      case StudyTimeSlot.NOON:
        // Khung giờ 12-13h
        return hour >= 12 && hour < 13;
      case StudyTimeSlot.EVENING:
        // Khung giờ 19-22h
        return hour >= 19 && hour < 22;
      default:
        return false;
    }
  }

  // Kiểm tra xem đã gửi thông báo hôm nay chưa
  private hasNotifiedToday(plan: StudyPlan, now: Date): boolean {
    if (!plan.lastNotificationDate) {
      return false;
    }

    const lastNotificationDate = new Date(plan.lastNotificationDate);

    return (
      lastNotificationDate.getDate() === now.getDate() &&
      lastNotificationDate.getMonth() === now.getMonth() &&
      lastNotificationDate.getFullYear() === now.getFullYear()
    );
  }

  // Thống kê tiến độ học tập
  async getStudyProgress(userId: number): Promise<any> {
    const studyPlan = await this.findByUserId(userId);

    const startDate = new Date(studyPlan.startDate);
    const targetDate = new Date(studyPlan.targetCompletionDate);
    const today = new Date();

    // Tính tổng số ngày và số ngày đã qua
    const totalDays = Math.round(
      (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysPassed = Math.round(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysLeft = Math.round(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Tính phần trăm hoàn thành theo thời gian
    const percentCompleted = Math.min(
      100,
      Math.max(0, Math.round((daysPassed / totalDays) * 100)),
    );

    return {
      startDate,
      targetDate,
      totalDays,
      daysPassed,
      daysLeft,
      percentCompleted,
      level: studyPlan.level,
      completionTimeMonths: studyPlan.completionTimeMonths,
      studyTimeSlot: studyPlan.studyTimeSlot,
    };
  }
}
