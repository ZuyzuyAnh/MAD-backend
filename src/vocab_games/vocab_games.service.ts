import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';
import { VocabGame } from './entities/vocab_game.entity';
import { LanguagesService } from 'src/languages/languages.service';
import { ProgressService } from 'src/progress/progress.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { VocabGameChallangeType } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';
import { VocabGameChallangesService } from 'src/vocab_game_challanges/vocab_game_challanges.service';

@Injectable()
export class VocabGamesService {
  constructor(
    @InjectRepository(VocabGame)
    private readonly vocabGameRepository: Repository<VocabGame>,
    private readonly languagesService: LanguagesService,
    private readonly progressService: ProgressService,
    private readonly vocabGameChallangesService: VocabGameChallangesService,
  ) {}

  async create(createVocabGameDto: CreateVocabGameDto): Promise<VocabGame> {
    const vocabGame = this.vocabGameRepository.create(createVocabGameDto);
    return this.vocabGameRepository.save(vocabGame);
  }

  async findVocabGameChallangeByVocabGameAndType(
    vocabGameId: number,
    type: VocabGameChallangeType,
  ) {
    return this.vocabGameChallangesService.findChallangeByGameIdAndType(
      vocabGameId,
      type,
    );
  }

  async findAll(paginateDto: PaginateDto, userId: number) {
    const languageId =
      await this.languagesService.getLanguageIdForCurrentUser(userId);

    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabGameRepository
      .createQueryBuilder('vocabGame')
      .select(['vocabGame.id', 'vocabGame.title', 'vocabTopic.name'])
      .innerJoin('vocabGame.vocabTopic', 'vocabTopic')
      .where('vocabTopic.languageId = :languageId', { languageId });

    const total = await queryBuilder.getCount();
    const vocabGames = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocabGame.createdAt', 'DESC')
      .getMany();
    const totalPages = Math.ceil(total / limit);
    return {
      data: vocabGames,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    return this.vocabGameRepository.findOne({
      where: { id },
      relations: ['vocabTopic', 'vocabGameChallanges'],
    });
  }

  async getVocabGameOverview(userId: number) {
    const languageId =
      await this.languagesService.getLanguageIdForCurrentUser(userId);

    const completed = await this.countCompletedGames(userId);
    const total = await this.countGameByLanguage(languageId);

    return {
      completed,
      total,
    };
  }

  async countCompletedGames(userId: number) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const count = await this.vocabGameRepository
      .createQueryBuilder('vocabGame')
      .innerJoin('vocabGame.vocabGameResults', 'vocabGameResult')
      .innerJoin('vocabGameResult.progress', 'progress')
      .where('progress.id = :progressId', { progressId: progress.id })
      .getCount();

    return count;
  }

  async countGameByLanguage(languageId: number) {
    const count = await this.vocabGameRepository
      .createQueryBuilder('vocabGame')
      .innerJoin('vocabGame.vocabTopic', 'vocabTopic')
      .where('vocabTopic.languageId = :languageId', { languageId })
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
