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
import { Language } from 'src/languages/entities/language.entity';
import { ExerciseQuestion } from 'src/exercise-questions/entities/exercise-question.entity';

export enum ExerciseType {
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
}

export enum ExerciseDifficulty {
  BEGINNER = 'beginner',
  NOVICE = 'novice',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('exercises')
export class Exercise {
  @ApiProperty({ description: 'ID của bài tập', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề bài tập',
    example: 'Thực hành đọc tiếng Anh cơ bản',
  })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về bài tập',
    example:
      'Bài tập giúp nâng cao khả năng đọc hiểu tiếng Anh cho người mới bắt đầu',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Loại bài tập',
    enum: ExerciseType,
    example: ExerciseType.GRAMMAR,
  })
  @Column({
    type: 'enum',
    enum: ExerciseType,
  })
  type: ExerciseType;

  @ApiProperty({
    description: 'Độ khó của bài tập',
    enum: ExerciseDifficulty,
    example: ExerciseDifficulty.BEGINNER,
  })
  @Column({
    type: 'enum',
    enum: ExerciseDifficulty,
    default: ExerciseDifficulty.BEGINNER,
  })
  difficulty: ExerciseDifficulty;

  @ApiProperty({ description: 'ID ngôn ngữ', example: 1 })
  @Column({ name: 'language_id' })
  languageId: number;

  @ApiProperty({ description: 'Thông tin ngôn ngữ của bài tập' })
  @ManyToOne(() => Language, { eager: true })
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ApiProperty({
    description: 'Danh sách câu hỏi của bài tập',
    type: () => [ExerciseQuestion],
  })
  @OneToMany(
    () => ExerciseQuestion,
    (exerciseQuestion) => exerciseQuestion.exercise,
    { eager: true },
  )
  questions: ExerciseQuestion[];

  @ApiProperty({
    description: 'Thời gian tạo bài tập',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật bài tập gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
