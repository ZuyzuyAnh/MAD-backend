import { ExamSectionType } from '../entities/exam_section.entity';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateExamSectionDto {
  @IsNotEmpty()
  @IsNumber()
  examId: number;

  @IsNotEmpty()
  @IsEnum(ExamSectionType)
  type: ExamSectionType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  audioUrl?: string;
}
