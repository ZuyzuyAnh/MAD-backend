import { Injectable } from '@nestjs/common';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';

@Injectable()
export class VocabGamesService {
  create(createVocabGameDto: CreateVocabGameDto) {
    return 'This action adds a new vocabGame';
  }

  findAll() {
    return `This action returns all vocabGames`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabGame`;
  }

  update(id: number, updateVocabGameDto: UpdateVocabGameDto) {
    return `This action updates a #${id} vocabGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabGame`;
  }
}
