import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExerciseDto } from './create-exercise.dto';
import { IsOptional } from 'class-validator';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto) {
  @ApiProperty({
    description: 'Trạng thái hoạt động của bài tập',
    example: true,
    required: false,
  })
  @IsOptional()
  active?: boolean;
}
