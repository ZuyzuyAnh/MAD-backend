import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { QuestionType } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @IsOptional()
  mediaUrl?: string;

  @IsOptional()
  explanation?: string;
}
