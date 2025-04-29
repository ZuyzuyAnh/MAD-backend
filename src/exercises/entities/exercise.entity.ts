import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Language } from 'src/languages/entities/language.entity';
import { Question } from 'src/questions/entities/question.entity';
import { ExerciseResult } from 'src/exercise_results/entities/exercise-result.entity';
import { SpeakingDatum } from 'src/speaking_data/entities/speaking_datum.entity';

export enum ExerciseType {
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
}

export enum ExerciseDifficulty {
  BEGINNER = 'beginner',
  NOVICE = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
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

  @Column({ type: 'text', nullable: true })
  theory: string;

  @Column({ name: 'audio_url', type: 'text', nullable: true })
  audioUrl: string;

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
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @OneToMany(() => ExerciseResult, (exerciseResult) => exerciseResult.exercise)
  exerciseResults: ExerciseResult[];

  @ManyToMany(() => Question, (question) => question.exercises)
  @JoinTable({
    name: 'exercise_questions',
  })
  questions: Question[];

  @OneToMany(() => SpeakingDatum, (speakingDatum) => speakingDatum.exercise)
  speakingData: SpeakingDatum[];

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
