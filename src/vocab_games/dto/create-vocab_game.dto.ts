import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVocabGameDto {
  @ApiProperty({
    description: 'Tiêu đề của trò chơi từ vựng',
    example: 'Động vật',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'ID của chủ đề từ vựng liên kết với trò chơi',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  vocabTopicId: number;
}
