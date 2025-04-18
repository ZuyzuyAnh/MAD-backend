import { Injectable } from '@nestjs/common';
import { CreateVocabGameResultDto } from './dto/create-vocab_game_result.dto';
import { UpdateVocabGameResultDto } from './dto/update-vocab_game_result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabGameResult } from './entities/vocab_game_result.entity';
import { Repository } from 'typeorm';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class VocabGameResultsService {
  constructor(
    @InjectRepository(VocabGameResult)
    private readonly vocabGameResultRepository: Repository<VocabGameResult>,
    private readonly progressService: ProgressService,
  ) {}

  async create(
    userId: number,
    createVocabGameResultDto: CreateVocabGameResultDto,
  ) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const vocabGameResult = this.vocabGameResultRepository.create({
      ...createVocabGameResultDto,
      progress,
    });

    return this.vocabGameResultRepository.save(vocabGameResult);
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
