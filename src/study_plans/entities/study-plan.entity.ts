import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum StudyLevel {
  BASIC = 'basic',
  ADVANCED = 'advanced',
  INTENSIVE = 'intensive',
}

export enum CompletionTime {
  ONE_MONTH = 1,
  THREE_MONTHS = 3,
  SIX_MONTHS = 6,
}

export enum StudyTimeSlot {
  MORNING = 'morning', // 6-9h
  WORK_HOURS = 'work_hours', // 7-8h & 17-18h
  NOON = 'noon', // 12-13h
  EVENING = 'evening', // 19-22h
}

@Entity('study_plans')
export class StudyPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: StudyLevel,
    default: StudyLevel.BASIC,
  })
  level: StudyLevel;

  @Column({
    name: 'completion_time_months',
    type: 'enum',
    enum: CompletionTime,
    default: CompletionTime.THREE_MONTHS,
  })
  completionTimeMonths: CompletionTime;

  @Column({
    type: 'enum',
    enum: StudyTimeSlot,
    default: StudyTimeSlot.EVENING,
  })
  studyTimeSlot: StudyTimeSlot;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'target_completion_date', type: 'date' })
  targetCompletionDate: Date;

  @Column({ name: 'last_notification_date', type: 'date', nullable: true })
  lastNotificationDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
