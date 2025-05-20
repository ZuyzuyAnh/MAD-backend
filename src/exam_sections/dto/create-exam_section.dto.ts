import { ExamSectionType } from '../entities/exam_section.entity';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamSectionDto {
  @ApiProperty({
    description: 'The ID of the exam this section belongs to',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  examId: number;

  @ApiProperty({
    description: 'The type of exam section (reading, listening, etc.)',
    enum: ExamSectionType,
    example: 'reading',
  })
  @IsNotEmpty()
  @IsEnum(ExamSectionType)
  type: ExamSectionType;

  @ApiProperty({
    description: 'The title of the exam section',
    example: 'Reading Comprehension',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Detailed description or instructions for the exam section',
    example: 'Read the passage carefully and answer the questions that follow.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL to audio file for listening sections',
    example: 'https://example.com/audio/listening-test-1.mp3',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  audioUrl?: string;
}
