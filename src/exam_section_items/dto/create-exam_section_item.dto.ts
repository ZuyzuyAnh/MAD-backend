import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamSectionItemDto {
  @ApiProperty({
    description: 'The ID of the exam section this item belongs to',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  examSectionId: number;

  @ApiProperty({
    description: 'The ID of the question to include in this section item',
    example: 42,
  })
  @IsInt()
  @IsPositive()
  questionId: number;
}
