import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty({
    description: 'The ID of the exam',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  examId: number;

  @ApiProperty({
    description: 'The score achieved in the exam (0-100)',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;
}
