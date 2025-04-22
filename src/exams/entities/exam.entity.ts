import { Language } from 'src/languages/entities/language.entity';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ExamResult } from 'src/exam_results/entities/exam_result.entity';
import { ExamSingleQuestion } from 'src/exam_single_questions/entities/exam_single_question.entity';
import { ExamSection } from 'src/exam_sections/entities/exam_section.entity';

export enum ExamType {
  WEEKLY = 'weekly',
  COMPREHENSIVE = 'comprehensive',
}

@Entity('exams')
export class Exam {
  @ApiProperty({
    description: 'ID của bài kiểm tra',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề bài kiểm tra',
    example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
  })
  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @ApiProperty({
    description: 'Loại bài kiểm tra',
    enum: ExamType,
    example: ExamType.WEEKLY,
  })
  @Column({
    type: 'enum',
    enum: ExamType,
  })
  type: ExamType;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @Column({ name: 'language_id' })
  languageId: number;

  @ApiProperty({
    description: 'Thông tin ngôn ngữ',
    type: () => Language,
  })
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ApiProperty({
    description: 'Thời gian tạo bài kiểm tra',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật bài kiểm tra gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ExamResult, (result) => result.exam)
  examResults: ExamResult[];

  @OneToMany(
    () => ExamSingleQuestion,
    (examSingleQuestion) => examSingleQuestion.exam,
  )
  examSingleQuestions: ExamSingleQuestion[];

  @OneToMany(() => ExamSection, (examSection) => examSection.exam)
  examSections: ExamSection[];
}
