import { PartialType } from '@nestjs/swagger';
import { CreateVocabRepetitionDto } from './create-vocab_repetition.dto';

export class UpdateVocabRepetitionDto extends PartialType(
  CreateVocabRepetitionDto,
) {}
