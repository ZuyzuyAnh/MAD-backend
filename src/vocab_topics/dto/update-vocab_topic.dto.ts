import { PartialType } from '@nestjs/swagger';
import { CreateVocabTopicDto } from './create-vocab_topic.dto';

export class UpdateVocabTopicDto extends PartialType(CreateVocabTopicDto) {}
