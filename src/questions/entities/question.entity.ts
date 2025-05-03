import { Exam } from 'src/exams/entities/exam.entity';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Language } from 'src/languages/entities/language.entity';
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
import { ApiProperty } from '@nestjs/swagger';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_BLANK = 'fill_in_blank',
  ORDERING = 'ordering',
  MATCHING = 'matching',
  TRUE_FALSE = 'true_false',
  ESSAY = 'essay',
}

@Entity('questions')
export class Question {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Loại câu hỏi',
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'What is the capital of France?',
  })
  @Column({ type: 'text' })
  question: string;

  @ApiProperty({
    description:
      'Các lựa chọn cho câu hỏi, định dạng tùy thuộc vào loại câu hỏi',
    example: ['Paris', 'London', 'Berlin', 'Rome'],
  })
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  options: string[];

  @ApiProperty({
    description: 'Đáp án đúng, có thể là JSON cho các câu hỏi phức tạp',
    example: 'Paris',
  })
  @Column()
  answer: string;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @Column({ name: 'language_id' })
  languageId: number;

  @ManyToMany(() => Exercise, (exercise) => exercise.questions)
  exercises: Exercise[];

  @ApiProperty({
    description: 'Thông tin ngôn ngữ',
    type: () => Language,
  })
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ApiProperty({
    description: 'Thời gian tạo câu hỏi',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật câu hỏi gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl?: string;
}
