import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVocabTopicDto } from './create-vocab_topic.dto';
import { IsOptional } from 'class-validator';
import { VocabLevel } from '../entities/vocab_topic.entity';

export class UpdateVocabTopicDto extends PartialType(CreateVocabTopicDto) {
  @ApiProperty({
    description: 'Tên chủ đề từ vựng',
    example: 'Động vật hoang dã',
    required: false,
  })
  @IsOptional()
  topic?: string;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
    required: false,
  })
  @IsOptional()
  languageId?: number;

  @ApiProperty({
    description: 'URL hình ảnh đại diện cho chủ đề',
    example: 'https://example.com/images/wild_animals.jpg',
    required: false,
  })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Cấp độ của chủ đề từ vựng',
    enum: VocabLevel,
    example: VocabLevel.MEDIUM,
    required: false,
  })
  @IsOptional()
  level?: VocabLevel;
}
