import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamSingleQuestionDto {
  @ApiProperty({
    description: 'The ID of the exam this question belongs to',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  examId: number;

  @ApiProperty({
    description: 'The ID of the question to add to the exam',
    example: 42,
  })
  @IsInt()
  @IsPositive()
  questionId: number;
}
