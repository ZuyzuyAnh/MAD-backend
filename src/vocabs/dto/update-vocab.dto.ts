import { PartialType } from '@nestjs/swagger';
import { CreateVocabDto } from './create-vocab.dto';

export class UpdateVocabDto extends PartialType(CreateVocabDto) {}
