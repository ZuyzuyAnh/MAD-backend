import { Module } from '@nestjs/common';
import { StudyScheduleService } from './study_schedule.service';
import { StudyScheduleController } from './study_schedule.controller';
import { ProgressModule } from 'src/progress/progress.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudySchedule } from './entities/study_schedule.entity';

@Module({
  imports: [ProgressModule, TypeOrmModule.forFeature([StudySchedule])],
  controllers: [StudyScheduleController],
  providers: [StudyScheduleService],
})
export class StudyScheduleModule {}
