import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVocabGameChallangeDto } from './dto/create-vocab_game_challange.dto';
import { UpdateVocabGameChallangeDto } from './dto/update-vocab_game_challange.dto';
import {
  VocabGameChallange,
  VocabGameChallangeType,
} from './entities/vocab_game_challange.entity';

@Injectable()
export class VocabGameChallangesService {
  constructor(
    @InjectRepository(VocabGameChallange)
    private readonly vocabGameChallangeRepository: Repository<VocabGameChallange>,
  ) {}

  async create(
    createVocabGameChallangeDto: CreateVocabGameChallangeDto,
  ): Promise<VocabGameChallange> {
    const challange = this.vocabGameChallangeRepository.create(
      createVocabGameChallangeDto,
    );
    return this.vocabGameChallangeRepository.save(challange);
  }

  async findChallangeByGameIdAndType(
    vocabGameId: number,
    type: VocabGameChallangeType,
  ) {
    return this.vocabGameChallangeRepository.find({
      where: {
        vocabGame: {
          id: vocabGameId,
        },
        type,
      },
    });
  }

  async findAll(): Promise<VocabGameChallange[]> {
    return this.vocabGameChallangeRepository.find({ relations: ['vocabGame'] });
  }

  async findOne(id: number) {
    return this.vocabGameChallangeRepository.findOne({
      where: { id },
      relations: ['vocabGame'],
    });
  }

  async update(
    id: number,
    updateVocabGameChallangeDto: UpdateVocabGameChallangeDto,
  ) {
    await this.vocabGameChallangeRepository.update(
      id,
      updateVocabGameChallangeDto,
    );
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.vocabGameChallangeRepository.delete(id);
  }
}
