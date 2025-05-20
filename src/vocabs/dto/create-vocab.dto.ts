import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for creating a new vocabulary
 */
export class CreateVocabDto {
  @ApiProperty({
    description: 'Từ vựng cần học',
    example: 'cat',
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  word: string;

  @ApiProperty({
    description: 'Định nghĩa hoặc nghĩa của từ vựng',
    example:
      'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
    minLength: 1,
    maxLength: 255,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  definition: string;

  @ApiProperty({
    description: 'Ví dụ câu sử dụng từ vựng',
    example: 'I have a pet cat at home.',
    required: false,
  })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({
    description: 'Bản dịch của câu ví dụ',
    example: 'Tôi có một con mèo cưng ở nhà.',
    required: false,
  })
  @IsOptional()
  @IsString()
  exampleTranslation?: string;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 1,
    required: true,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  topicId: number;

  @ApiProperty({
    description: 'URL hình ảnh minh họa cho từ vựng',
    example: 'https://example.com/images/cat.jpg',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  transcription: string;
}
