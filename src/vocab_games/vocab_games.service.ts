import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';
import { VocabGame } from './entities/vocab_game.entity';

@Injectable()
export class VocabGamesService {
  constructor(
    @InjectRepository(VocabGame)
    private readonly vocabGameRepository: Repository<VocabGame>,
  ) {}

  async create(createVocabGameDto: CreateVocabGameDto): Promise<VocabGame> {
    const vocabGame = this.vocabGameRepository.create(createVocabGameDto);
    return this.vocabGameRepository.save(vocabGame);
  }

  async findAll(): Promise<VocabGame[]> {
    return this.vocabGameRepository.find({
      relations: ['vocabTopic', 'vocabGameChallanges'],
    });
  }

  async findOne(id: number) {
    return this.vocabGameRepository.findOne({
      where: { id },
      relations: ['vocabTopic', 'vocabGameChallanges'],
    });
  }

  async update(id: number, updateVocabGameDto: UpdateVocabGameDto) {
    await this.vocabGameRepository.update(id, updateVocabGameDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.vocabGameRepository.delete(id);
  }
}
