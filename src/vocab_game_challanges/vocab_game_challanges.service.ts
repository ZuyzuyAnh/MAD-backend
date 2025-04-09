import { Injectable } from '@nestjs/common';
import { CreateVocabGameChallangeDto } from './dto/create-vocab_game_challange.dto';
import { UpdateVocabGameChallangeDto } from './dto/update-vocab_game_challange.dto';

@Injectable()
export class VocabGameChallangesService {
  create(createVocabGameChallangeDto: CreateVocabGameChallangeDto) {
    return 'This action adds a new vocabGameChallange';
  }

  findAll() {
    return `This action returns all vocabGameChallanges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabGameChallange`;
  }

  update(id: number, updateVocabGameChallangeDto: UpdateVocabGameChallangeDto) {
    return `This action updates a #${id} vocabGameChallange`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabGameChallange`;
  }
}
