import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Language } from '../../languages/entities/language.entity';
import { Exclude } from 'class-transformer';
import { StudySchedule } from 'src/study_schedule/entities/study_schedule.entity';

@Entity('progress')
@Unique(['user', 'language'])
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'language_id' })
  languageId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'is_current_active', default: true })
  isCurrentActive: boolean;

  @OneToMany(() => StudySchedule, (studySchedule) => studySchedule.progress, {
    onDelete: 'CASCADE',
  })
  studySchedules: StudySchedule[];
}
