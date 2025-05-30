import { Exam } from 'src/exams/entities/exam.entity';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('exam_single_questions')
@Unique(['examId', 'questionId'])
export class ExamSingleQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_id' })
  examId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @ManyToOne(() => Exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => Question, (question) => question.id)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
