import { Exam } from 'src/exams/entities/exam.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ExamSectionType {
  READING = 'reading',
  LISTENING = 'listening',
}

@Entity('exam_sections')
export class ExamSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ name: 'type', enum: ExamSectionType })
  type: ExamSectionType;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
