import { PartialType } from '@nestjs/swagger';
import { CreateStudyScheduleDto } from './create-study_schedule.dto';

export class UpdateStudyScheduleDto extends PartialType(
  CreateStudyScheduleDto,
) {}
