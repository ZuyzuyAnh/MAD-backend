import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';
import { VocabGame } from './entities/vocab_game.entity';
import { LanguagesService } from 'src/languages/languages.service';

@Injectable()
export class VocabGamesService {
  constructor(
    @InjectRepository(VocabGame)
    private readonly vocabGameRepository: Repository<VocabGame>,
    private readonly LanguagesService: LanguagesService,
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

  async getVocabGameOverview(userId: number) {
    const languageId =
      await this.LanguagesService.getLanguageIdForCurrentUser(userId);
  }

  async countCompletedGames(userId: number, languageId: number) {
    const count = await this.vocabGameRepository
      .createQueryBuilder('vocabGame')
      .innerJoin('vocabGame.vocabGameChallanges', 'vocabGameChallange')
      .where('vocabGameChallange.userId = :userId', { userId })
      .andWhere('vocabGame.languageId = :languageId', { languageId })
      .getCount();

    return count;
  }

  async update(id: number, updateVocabGameDto: UpdateVocabGameDto) {
    await this.vocabGameRepository.update(id, updateVocabGameDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.vocabGameRepository.delete(id);
  }
}
