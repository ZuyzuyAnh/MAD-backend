import { VocabGameChallangeType } from '../entities/vocab_game_challange.entity';

export class CreateVocabGameChallangeDto {
  vocabGameId: number;
  data: any; // Replace with a specific type if available
  type: VocabGameChallangeType;
}
