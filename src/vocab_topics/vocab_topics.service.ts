import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVocabTopicDto } from './dto/create-vocab_topic.dto';
import { UpdateVocabTopicDto } from './dto/update-vocab_topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabLevel, VocabTopic } from './entities/vocab_topic.entity';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';
import { LanguagesService } from 'src/languages/languages.service';
import { ProgressService } from 'src/progress/progress.service';
import { VocabTopicProgressService } from 'src/vocab_topic_progress/vocab_topic_progress.service';
import { VocabsService } from 'src/vocabs/vocabs.service';
import { VocabGameResultsService } from 'src/vocab_game_results/vocab_game_results.service';

@Injectable()
export class VocabTopicsService {
  constructor(
    @InjectRepository(VocabTopic)
    private readonly vocabTopicRepository: Repository<VocabTopic>,
    private readonly languageService: LanguagesService,
    private readonly progressService: ProgressService,
    private readonly vocabTopicProgressService: VocabTopicProgressService,
    private readonly vocabService: VocabsService,
    private readonly vocabGameResultService: VocabGameResultsService,
  ) {}

  async create(createVocabTopicDto: CreateVocabTopicDto): Promise<VocabTopic> {
    const vocabTopic = this.vocabTopicRepository.create({
      ...createVocabTopicDto,
      language: {
        id: createVocabTopicDto.languageId,
      },
    });

    return this.vocabTopicRepository.save(vocabTopic);
  }

  async findAllForUser(
    userId: number,
    paginateDto: PaginateDto,
    topic?: string,
    level?: VocabLevel,
  ) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    return this.findAll(paginateDto, userId, topic, languageId, level);
  }

  async findAll(
    paginateDto: PaginateDto,
    userId?: number,
    topic?: string,
    languageId?: number,
    level?: VocabLevel,
    isRandom?: boolean,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabTopicRepository
      .createQueryBuilder('vocab_topic')
      .select([
        'vocab_topic.id',
        'vocab_topic.topic',
        'vocab_topic.level',
        'vocab_topic.imageUrl',
        'vocab_topic.createdAt',
        'vocab_topic.updatedAt',
        'language.id',
      ])
      .innerJoin('vocab_topic.language', 'language')
      .leftJoin('vocab_topic.vocabTopicProgress', 'vocab_topic_progress')
      .loadRelationCountAndMap('vocab_topic.totalVocabs', 'vocab_topic.vocabs');

    if (userId) {
      const progress =
        await this.progressService.findCurrentActiveProgress(userId);

      queryBuilder.leftJoinAndSelect(
        'vocab_topic.vocabTopicProgress',
        'vtp',
        'vtp.progressId = :progressId',
        { progressId: progress.id },
      );
    }

    if (topic) {
      queryBuilder.andWhere('LOWER(vocab_topic.topic) LIKE LOWER(:topic)', {
        topic: `%${topic}%`,
      });
    }

    if (languageId) {
      queryBuilder.andWhere('vocab_topic.language.id = :languageId', {
        languageId,
      });
    }

    if (level) {
      queryBuilder.andWhere('vocab_topic.level = :level', { level });
    }

    if (isRandom) {
      queryBuilder.orderBy('RAND()');
    }

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocab_topic.topic', 'ASC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    const data = results.map((result) => {
      const { vocabTopicProgress, ...rest } = result;
      return {
        ...rest,
        hasProgress: result.vocabTopicProgress.length > 0,
      };
    });

    return {
      data,
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

  async findOne(id: number): Promise<VocabTopic> {
    const vocabTopic = await this.vocabTopicRepository.findOne({
      where: { id },
      relations: ['language'],
    });

    if (!vocabTopic) {
      throw new NotfoundException('vocabulary topic', 'id', id);
    }

    return vocabTopic;
  }

  async update(
    id: number,
    updateVocabTopicDto: UpdateVocabTopicDto,
    image?: Express.Multer.File,
  ): Promise<VocabTopic> {
    const vocabTopic = await this.findOne(id);

    Object.assign(vocabTopic, updateVocabTopicDto);

    return this.vocabTopicRepository.save(vocabTopic);
  }

  async countCompletedVocabTopics(userId: number) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const totalCount = await this.vocabTopicRepository.countBy({
      language: { id: progress.language.id },
    });

    const completedCount = await this.vocabTopicProgressService.countByProgress(
      progress.id,
    );

    return {
      total: totalCount,
      completed: completedCount,
    };
  }

  async remove(id: number): Promise<VocabTopic> {
    const vocabTopic = await this.findOne(id);

    return this.vocabTopicRepository.remove(vocabTopic);
  }

  /**
   * Lấy danh sách chủ đề từ vựng mà người dùng đang học
   * @param userId ID của người dùng
   * @param paginateDto Thông số phân trang
   * @returns Danh sách chủ đề từ vựng đang học và thông tin phân trang
   */
  async findLearningTopics(userId: number, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabTopicRepository
      .createQueryBuilder('vocab_topic')
      .innerJoin(
        'vocab_topic_progress',
        'vocab_topic_progress',
        'vocab_topic_progress.topicId = vocab_topic.id',
      )
      .innerJoin(
        'vocab_topic_progress.progress',
        'progress',
        'progress.userId = :userId AND progress.isCurrentActive = true',
        { userId },
      )
      .leftJoinAndSelect('vocab_topic.language', 'language')
      .loadRelationCountAndMap('vocab_topic.totalVocabs', 'vocab_topic.vocabs');

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocab_topic.topic', 'ASC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: results,
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

  async getWordLinkByTopic(topicId: number) {
    return this.vocabService.getWordLinkChallange(topicId);
  }

  async getScrambleByTopic(topicId: number) {
    return this.vocabService.getScrambleChallange(topicId);
  }

  async getListeningByTopic(topicId: number) {
    return this.vocabService.getListeningChallange(topicId);
  }

  async countCompletedAndTotalOfGame(userId: number) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const totalCount = await this.vocabTopicRepository.countBy({
      languageId: progress.language.id,
    });

    const completedCount = await this.vocabGameResultService.countByProgress(
      progress.id,
    );

    return {
      total: totalCount,
      completed: completedCount,
    };
  }
}
