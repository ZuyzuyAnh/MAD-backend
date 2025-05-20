import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { VocabLevel } from '../entities/vocab_topic.entity';
import { Type } from 'class-transformer';

export class CreateVocabTopicDto {
  @ApiProperty({
    description: 'Tên chủ đề từ vựng',
    example: 'Động vật',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100)
  topic: string;

  @ApiProperty({
    description: 'ID của ngôn ngữ',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  languageId: number;

  @ApiProperty({
    description: 'URL hình ảnh đại diện cho chủ đề',
    example: 'https://example.com/images/animals.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Cấp độ của chủ đề từ vựng',
    enum: VocabLevel,
    default: VocabLevel.BEGINNER,
    example: VocabLevel.BEGINNER,
  })
  @IsEnum(VocabLevel)
  @IsOptional()
  level?: VocabLevel = VocabLevel.BEGINNER;
}