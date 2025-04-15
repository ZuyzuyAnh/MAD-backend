import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Progress } from '../../progress/entities/progress.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('exercise_results')
@Unique(['progress', 'exercise', 'createdAt'])
export class ExerciseResult {
  @ApiProperty({
    description: 'ID của kết quả bài tập',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID của tiến độ học tập',
    example: 1,
  })
  @Column({ name: 'progress_id' })
  progressId: number;

  @ApiProperty({
    description: 'ID của bài tập',
    example: 1,
  })
  @Column({ name: 'exercise_id' })
  exerciseId: number;

  @ApiProperty({
    description: 'Điểm số của bài tập',
    example: 85.5,
  })
  @Column({ type: 'float', default: 0 })
  score: number;

  @ApiProperty({
    description: 'Thông tin về tiến độ học tập',
    type: () => Progress,
  })
  @ManyToOne(() => Progress)
  @JoinColumn({ name: 'progress_id' })
  progress: Progress;

  @ApiProperty({
    description: 'Thông tin về bài tập',
    type: () => Exercise,
  })
  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @ApiProperty({
    description: 'Thời gian tạo kết quả',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật kết quả gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
