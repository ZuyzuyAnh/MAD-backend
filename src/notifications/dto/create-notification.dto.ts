import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsBoolean } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType = NotificationType.SYSTEM;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}