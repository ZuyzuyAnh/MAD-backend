import { PartialType } from '@nestjs/swagger';
import { CreateVocabGameResultDto } from './create-vocab_game_result.dto';

export class UpdateVocabGameResultDto extends PartialType(
  CreateVocabGameResultDto,
) {}
