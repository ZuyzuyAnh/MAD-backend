import { Exam } from 'src/exams/entities/exam.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('exam_single_questions')
export class ExamSingleQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'sequence' })
  sequence: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;
}
