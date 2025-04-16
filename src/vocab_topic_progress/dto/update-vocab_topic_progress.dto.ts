import { PartialType } from '@nestjs/swagger';
import { CreateVocabTopicProgressDto } from './create-vocab_topic_progress.dto';

export class UpdateVocabTopicProgressDto extends PartialType(CreateVocabTopicProgressDto) {}
