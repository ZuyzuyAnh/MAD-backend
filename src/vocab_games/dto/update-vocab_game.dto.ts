import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVocabGameDto } from './create-vocab_game.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateVocabGameDto extends PartialType(CreateVocabGameDto) {
  @ApiProperty({
    description: 'Tiêu đề của trò chơi từ vựng',
    example: 'Động vật hoang dã',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng liên kết với trò chơi',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  vocabTopicId?: number;
}
