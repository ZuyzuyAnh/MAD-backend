import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExerciseResultDto } from './create-exercise-result.dto';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateExerciseResultDto extends PartialType(
  CreateExerciseResultDto,
) {
  @ApiProperty({
    description: 'Điểm số của bài tập (0-100)',
    example: 90.5,
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  score?: number;
}
