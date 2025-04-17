import { PartialType } from '@nestjs/mapped-types';
import { CreateVocabGameChallangeDto } from './create-vocab_game_challange.dto';

export class UpdateVocabGameChallangeDto extends PartialType(
  CreateVocabGameChallangeDto,
) {}
