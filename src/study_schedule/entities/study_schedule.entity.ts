import { Progress } from 'src/progress/entities/progress.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  Unique,
} from 'typeorm';

@Entity('study_schedules')
@Unique(['progressId', 'weekday'])
@Check('CHK_weekday_range', 'weekday >= 0 AND weekday <= 6')
export class StudySchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'progress_id' })
  progressId: number;

  @Column({ name: 'weekday' })
  weekday: number;

  @Column({ name: 'study_time', type: 'time' })
  studyTime: string;

  @ManyToOne(() => Progress, (progress) => progress.studySchedules, {
    onDelete: 'CASCADE',
  })
  progress: Progress;
}
