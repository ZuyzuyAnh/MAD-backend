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
import { ApiProperty } from '@nestjs/swagger';

@Entity('exercise_questions')
export class ExerciseQuestion {
  @ApiProperty({ description: 'ID của câu hỏi', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'Đâu là thủ đô của Việt Nam?',
  })
  @Column({ name: 'question' })
  question: string;

  @ApiProperty({
    description: 'Các lựa chọn cho câu hỏi',
    example: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Huế'],
  })
  @Column('text', { name: 'options', array: true })
  options: string[];

  @ApiProperty({ description: 'Đáp án đúng', example: 'Hà Nội' })
  @Column({ name: 'answer' })
  answer: string;

  @ApiProperty({
    description: 'URL của media liên quan đến câu hỏi',
    example: 'https://example.com/images/hanoi.jpg',
  })
  @Column({ name: 'media_url' })
  mediaURL: string;

  @ManyToOne(() => Exercise, (exercise) => exercise.questions)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

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
}
