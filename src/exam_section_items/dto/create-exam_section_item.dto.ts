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

  @ApiProperty({
    description: 'The sequence order of this item within the section',
    example: 3,
  })
  @IsInt()
  @IsPositive()
  sequence: number;
}
