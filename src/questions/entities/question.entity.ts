import { Exam } from 'src/exams/entities/exam.entity';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple choice',
  FILL_IN_BLANK = 'fill in the blank',
  PRONOUNCIATION = 'pronounciation',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  options: string[];

  @ManyToOne(() => Exam, (exam) => exam.questions)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @ManyToOne(() => Exercise, (exercise) => exercise.questions)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column()
  answer: string;

  @Column()
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
