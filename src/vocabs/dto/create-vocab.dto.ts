import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VocabDifficulty } from '../entities/vocab.entity';

export class CreateVocabDto {
  @IsString()
  @Length(1, 100)
  word: string;

  @IsString()
  @Length(1, 255)
  definition: string;

  @IsOptional()
  @IsString()
  example?: string;

  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @IsEnum(VocabDifficulty)
  difficulty: VocabDifficulty;

  @IsNumber()
  topicId: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
