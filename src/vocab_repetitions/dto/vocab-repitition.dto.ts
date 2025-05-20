import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { VocabDifficulty } from '../../vocabs/entities/vocab.entity';

export class UpdateRepetitionDto {
  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 2,
    required: true,
  })
  @IsNumber()
  topicId: number;

  @ApiProperty({
    description: 'ID của từ vựng cần cập nhật',
    example: 3,
    required: true,
  })
  @IsNumber()
  vocabId: number;

  @ApiProperty({
    description: 'Mức độ khó đánh giá của người dùng về từ vựng',
    enum: VocabDifficulty,
    enumName: 'Mức độ khó',
    example: VocabDifficulty.EASY,
    required: true,
  })
  @IsEnum(VocabDifficulty)
  difficulty: VocabDifficulty;
}
