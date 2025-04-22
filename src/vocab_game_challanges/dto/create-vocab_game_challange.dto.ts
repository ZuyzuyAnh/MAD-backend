import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { VocabGameChallangeType } from '../entities/vocab_game_challange.entity';

export class CreateVocabGameChallangeDto {
  @ApiProperty({
    description: 'ID của trò chơi từ vựng',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  vocabGameId: number;

  @ApiProperty({
    description: 'Loại thử thách từ vựng',
    enum: VocabGameChallangeType,
    example: VocabGameChallangeType.LINK,
  })
  @IsEnum(VocabGameChallangeType)
  @IsNotEmpty()
  type: VocabGameChallangeType;

  @ApiProperty({
    description: 'Dữ liệu thử thách, định dạng phụ thuộc vào loại thử thách',
    example: {
      words: [
        { word: 'cat', translation: 'mèo' },
        { word: 'dog', translation: 'chó' },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  data: any;
}
