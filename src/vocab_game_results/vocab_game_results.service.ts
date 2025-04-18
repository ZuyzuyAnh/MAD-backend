import { Injectable } from '@nestjs/common';
import { CreateVocabGameResultDto } from './dto/create-vocab_game_result.dto';
import { UpdateVocabGameResultDto } from './dto/update-vocab_game_result.dto';

@Injectable()
export class VocabGameResultsService {
  create(createVocabGameResultDto: CreateVocabGameResultDto) {
    return 'This action adds a new vocabGameResult';
  }

  findAll() {
    return `This action returns all vocabGameResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabGameResult`;
  }

  update(id: number, updateVocabGameResultDto: UpdateVocabGameResultDto) {
    return `This action updates a #${id} vocabGameResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabGameResult`;
  }
}
