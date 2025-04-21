import { VocabDifficulty } from 'src/vocabs/entities/vocab.entity';
import { IsInt, IsEnum } from 'class-validator';

export class CreateVocabRepetitionDto {
  @IsInt()
  topicId: number;

  @IsInt()
  vocabId: number;

  @IsEnum(VocabDifficulty)
  difficulty: VocabDifficulty;
}
