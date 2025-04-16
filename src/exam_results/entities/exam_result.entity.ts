import Joi from 'joi';
import { Exam } from 'src/exams/entities/exam.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('exam_results')
export class ExamResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ name: 'progress_id' })
  progressId: number;

  @Column({ name: 'score' })
  score: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => Progress)
  @JoinColumn({ name: 'progress_id' })
  progress: Progress;
}
