import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { VocabDifficulty } from '../../vocabs/entities/vocab.entity';

export class UpdateRepetitionDto {
  @ApiProperty({
    description: 'ID của Progress',
    example: 1,
  })
  @ApiProperty({
    description: 'ID của Topic',
    example: 2,
  })
  @IsNumber()
  topicId: number;

  @ApiProperty({
    description: 'ID của từ vựng',
    example: 3,
  })
  @IsNumber()
  vocabId: number;

  @ApiProperty({
    description: 'Độ khó đánh giá',
    enum: VocabDifficulty,
    example: VocabDifficulty.INTERMEDIATE,
  })
  @IsEnum(VocabDifficulty)
  difficulty: VocabDifficulty;
}
