import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { VocabDifficulty } from '../entities/vocab.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVocabDto {
  @ApiProperty({
    description: 'Từ vựng',
    example: 'cat',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  word: string;

  @ApiProperty({
    description: 'Định nghĩa của từ vựng',
    example:
      'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  definition: string;

  @ApiProperty({
    description: 'Ví dụ sử dụng từ vựng',
    example: 'I have a pet cat at home.',
    required: false,
  })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({
    description: 'Bản dịch của ví dụ',
    example: 'Tôi có một con mèo cưng ở nhà.',
    required: false,
  })
  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @ApiProperty({
    description: 'Độ khó của từ vựng',
    enum: VocabDifficulty,
    example: VocabDifficulty.BEGINNER,
  })
  @IsEnum(VocabDifficulty)
  difficulty: VocabDifficulty;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 1,
  })
  @IsNumber()
  topicId: number;

  @ApiProperty({
    description: 'URL hình ảnh minh họa cho từ vựng',
    example: 'https://example.com/images/cat.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
