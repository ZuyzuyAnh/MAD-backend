import { PartialType } from '@nestjs/swagger';
import { CreateVocabGameChallangeDto } from './create-vocab_game_challange.dto';

export class UpdateVocabGameChallangeDto extends PartialType(CreateVocabGameChallangeDto) {}
