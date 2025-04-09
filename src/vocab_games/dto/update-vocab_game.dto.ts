import { PartialType } from '@nestjs/swagger';
import { CreateVocabGameDto } from './create-vocab_game.dto';

export class UpdateVocabGameDto extends PartialType(CreateVocabGameDto) {}
