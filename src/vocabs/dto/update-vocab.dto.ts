import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVocabDto } from './create-vocab.dto';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

/**
 * DTO for updating an existing vocabulary
 * Makes all properties from CreateVocabDto optional
 */
export class UpdateVocabDto extends PartialType(CreateVocabDto) {
  @ApiProperty({
    description: 'Từ vựng cần học',
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
    description: 'Định nghĩa hoặc nghĩa của từ vựng',
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
    description: 'Ví dụ câu sử dụng từ vựng',
    example: 'The cat is sleeping on the sofa.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({
    description: 'Bản dịch của câu ví dụ',
    example: 'Con mèo đang ngủ trên ghế sofa.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 2,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  topicId?: number;

  @ApiProperty({
    description: 'URL hình ảnh minh họa cho từ vựng',
    example: 'https://example.com/images/cat_updated.jpg',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @Length(1, 255)
  transcription: string;
}
