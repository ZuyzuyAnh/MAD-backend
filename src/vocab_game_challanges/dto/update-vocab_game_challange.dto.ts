import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVocabGameChallangeDto } from './create-vocab_game_challange.dto';
import { VocabGameChallangeType } from '../entities/vocab_game_challange.entity';

export class UpdateVocabGameChallangeDto extends PartialType(
  CreateVocabGameChallangeDto,
) {
  @ApiProperty({
    description: 'ID của trò chơi từ vựng',
    example: 1,
    required: false,
  })
  vocabGameId?: number;

  @ApiProperty({
    description: 'Loại thử thách từ vựng',
    enum: VocabGameChallangeType,
    example: VocabGameChallangeType.LINK,
    required: false,
  })
  type?: VocabGameChallangeType;

  @ApiProperty({
    description: 'Dữ liệu thử thách, định dạng phụ thuộc vào loại thử thách',
    example: {
      words: [
        { word: 'cat', translation: 'mèo' },
        { word: 'dog', translation: 'chó' },
        { word: 'bird', translation: 'chim' },
      ],
    },
    required: false,
  })
  data?: any;
}
