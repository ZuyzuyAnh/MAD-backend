import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  StudyLevel,
  CompletionTime,
  StudyTimeSlot,
} from '../entities/study-plan.entity';

export class CreateStudyPlanDto {
  @ApiProperty({
    description: 'Mức độ học tập',
    enum: StudyLevel,
    example: StudyLevel.BASIC,
  })
  @IsEnum(StudyLevel)
  level: StudyLevel;

  @ApiProperty({
    description: 'Thời gian hoàn thành (tháng)',
    enum: CompletionTime,
    example: CompletionTime.THREE_MONTHS,
  })
  @IsEnum(CompletionTime)
  completionTimeMonths: CompletionTime;

  @ApiProperty({
    description: 'Khung giờ học tập trong ngày',
    enum: StudyTimeSlot,
    example: StudyTimeSlot.EVENING,
  })
  @IsEnum(StudyTimeSlot)
  studyTimeSlot: StudyTimeSlot;
}
