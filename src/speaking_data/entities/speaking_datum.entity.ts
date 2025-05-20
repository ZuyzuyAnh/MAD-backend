import { ApiProperty } from '@nestjs/swagger';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('speaking_data')
export class SpeakingDatum {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID của dữ liệu luyện nói',
    example: 1,
  })
  id: number;

  @Column({ type: 'jsonb' })
  @ApiProperty({
    description: 'Dữ liệu câu luyện nói',
    example: {
      sentence: 'How are you today?',
      translation: 'Bạn khỏe không hôm nay?',
    },
  })
  data: {
    sentence: string;
    translation: string;
  }[];

  @Column({ name: 'exercise_id' })
  @ApiProperty({
    description: 'ID của bài tập',
    example: 1,
  })
  exerciseId: number;

  @ManyToOne(() => Exercise, (exercise) => exercise.speakingData)
  exercise: Exercise;
}
