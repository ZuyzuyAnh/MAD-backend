import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import EntityNotFoundException from '../exception/notfound.exception';
import { MoreThan } from 'typeorm';
import { User } from '../users/entities/user.entity';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
    userId?: number,
  ): Promise<Notification | Notification[]> {
    if (userId) {
      const notification = this.notificationRepository.create({
        ...createNotificationDto,
        userId,
      });
      return this.notificationRepository.save(notification);
    } else {
      const allUsers = await this.userRepository.find();
      const notifications = allUsers.map((user) =>
        this.notificationRepository.create({
          ...createNotificationDto,
          userId: user.id,
        }),
      );
      return this.notificationRepository.save(notifications);
    }
  }

  async createSystemNotification(
    title: string,
    content: string,
    data?: Record<string, any>,
    userId?: number,
  ): Promise<Notification | Notification[]> {
    return this.create(
      {
        title,
        content,
        type: NotificationType.SYSTEM,
        data,
      },
      userId,
    );
  }

  async createCommentNotification(
    userId: number,
    commenterName: string,
    postId: number,
  ): Promise<Notification> {
    return this.create(
      {
        title: 'Bình luận mới',
        content: `${commenterName} đã bình luận bài viết của bạn`,
        type: NotificationType.COMMENT,
        data: { postId },
      },
      userId,
    ) as Promise<Notification>;
  }

  async createLikeNotification(
    userId: number,
    likerName: string,
    postId: number,
    postTitle: string,
  ): Promise<Notification> {
    return this.create(
      {
        title: 'Lượt thích mới',
        content: `${likerName} đã thích bài viết "${postTitle}" của bạn`,
        type: NotificationType.LIKE,
        data: { postId },
      },
      userId,
    ) as Promise<Notification>;
  }

  async createAchievementNotification(
    userId: number,
    achievementTitle: string,
  ): Promise<Notification> {
    return this.create(
      {
        title: 'Thành tựu mới',
        content: `Bạn đã đạt được thành tựu: ${achievementTitle}`,
        type: NotificationType.ACHIEVEMENT,
        data: { achievementTitle },
      },
      userId,
    ) as Promise<Notification>;
  }

  async findAll(userId: number, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    const total = await queryBuilder.getCount();
    const notifications = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: notifications,
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

  async findOne(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new EntityNotFoundException('notification', 'id', id);
    }

    return notification;
  }

  async markAsRead(id: number): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async getNewNotifications(
    userId: number,
    lastCheckTime: Date,
  ): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        userId,
        createdAt: MoreThan(lastCheckTime),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }
}
