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
    description: 'Tuần của bài kiểm tra (đối với bài kiểm tra hàng tuần)',
    example: 3,
    nullable: true,
  })
  @Column({ nullable: true })
  week: number;

  @ApiProperty({
    description: 'Tiêu đề bài kiểm tra',
    example: 'Kiểm tra ngữ pháp tiếng Anh tuần 3',
  })
  @Column({ type: 'text' })
  title: string;

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
    description: 'Danh sách câu hỏi trong bài kiểm tra',
    type: () => [Question],
  })
  @OneToMany(() => Question, (question) => question.exam)
  questions: Question[];

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
}
