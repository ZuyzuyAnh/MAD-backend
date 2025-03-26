import { PartialType } from '@nestjs/mapped-types';
import { CreateVocabDto } from './create-vocab.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VocabDifficulty } from '../entities/vocab.entity';

export class UpdateVocabDto extends PartialType(CreateVocabDto) {
  @ApiProperty({
    description: 'Từ vựng',
    example: 'cat',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  word?: string;

  @ApiProperty({
    description: 'Định nghĩa của từ vựng',
    example:
      'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  definition?: string;

  @ApiProperty({
    description: 'Ví dụ sử dụng từ vựng',
    example: 'The cat is sleeping on the sofa.',
    required: false,
  })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({
    description: 'Bản dịch của ví dụ',
    example: 'Con mèo đang ngủ trên ghế sofa.',
    required: false,
  })
  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @ApiProperty({
    description: 'Độ khó của từ vựng',
    enum: VocabDifficulty,
    example: VocabDifficulty.BEGINNER,
    required: false,
  })
  @IsOptional()
  @IsEnum(VocabDifficulty)
  difficulty?: VocabDifficulty;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  topicId?: number;

  @ApiProperty({
    description: 'URL hình ảnh minh họa cho từ vựng',
    example: 'https://example.com/images/cat_updated.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
