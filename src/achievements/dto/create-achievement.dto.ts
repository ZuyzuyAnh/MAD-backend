import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAchievementDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  badgeImageUrl?: string;

  @IsNotEmpty()
  @IsString()
  triggerCondition: string;

  @IsNotEmpty()
  @IsNumber()
  conditionValue: number;
}
