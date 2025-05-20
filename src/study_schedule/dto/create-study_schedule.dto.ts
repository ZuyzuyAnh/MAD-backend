import {
  IsInt,
  IsNotEmpty,
  Min,
  Max,
  IsDateString,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudyScheduleDto {
  @IsInt()
  @IsNotEmpty()
  @Min(0, { message: 'Weekday must be between 0 and 6 (Sunday to Saturday)' })
  @Max(6, { message: 'Weekday must be between 0 and 6 (Sunday to Saturday)' })
  weekday: number;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'Study time must be in format HH:MM or HH:MM:SS',
  })
  studyTime: string;
}
