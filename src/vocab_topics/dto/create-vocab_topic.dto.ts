import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VocabLevel } from '../entities/vocab_topic.entity';

export class CreateVocabTopicDto {
  @IsString()
  @Length(1, 100)
  topic: string;

  @IsNumber()
  languageId: number;

  @IsEnum(VocabLevel)
  level: VocabLevel;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
