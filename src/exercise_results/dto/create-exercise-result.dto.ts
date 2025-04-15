import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class CreateExerciseResultDto {
  @ApiProperty({
    description: 'ID của tiến độ học tập',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  progressId: number;

  @ApiProperty({
    description: 'ID của bài tập',
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  exerciseId: number;

  @ApiProperty({
    description: 'Điểm số của bài tập (0-100)',
    example: 85.5,
    default: 0,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number = 0;
}
