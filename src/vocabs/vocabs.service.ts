import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Vocab } from './entities/vocab.entity';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import NotfoundException from '../exception/notfound.exception';
import { VocabTopicProgress } from 'src/vocab_topic_progress/entities/vocab_topic_progress.entity';
import EntityNotFoundException from '../exception/notfound.exception';
import { Language } from 'src/languages/entities/language.entity';
import { LanguagesService } from 'src/languages/languages.service';

@Injectable()
export class VocabsService {
  constructor(
    @InjectRepository(Vocab)
    private vocabRepository: Repository<Vocab>,
    private languageService: LanguagesService,
  ) {}

  async create(createVocabDto: CreateVocabDto): Promise<Vocab> {
    const vocab = this.vocabRepository.create({
      ...createVocabDto,
      topic: { id: createVocabDto.topicId },
    });

    return this.vocabRepository.save(vocab);
  }

  async findAll(paginateDto: PaginateDto, word?: string, topicId?: number) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabRepository.createQueryBuilder('vocab');

    if (word) {
      queryBuilder.where('vocab.word LIKE :word', { word: `%${word}%` });
    }

    if (topicId) {
      if (word) {
        queryBuilder.andWhere('vocab.topicId = :topicId', { topicId });
      } else {
        queryBuilder.where('vocab.topicId = :topicId', { topicId });
      }
    }

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocab.createdAt', 'DESC')
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

  async findRandomVocabsForUser(userId: number) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const randomVocabs = this.vocabRepository
      .createQueryBuilder('vocab')
      .innerJoin('vocab.topic', 'topic')
      .innerJoin('topic.language', 'language')
      .where('language.id = :languageId', { languageId })
      .limit(20)
      .orderBy('RANDOM()')
      .getMany();

    return randomVocabs;
  }

  async findOne(id: number): Promise<Vocab> {
    const vocab = await this.vocabRepository.findOneBy({ id });

    if (!vocab) {
      throw new NotfoundException('vocabulary', 'id', id);
    }

    return vocab;
  }

  async update(id: number, updateVocabDto: UpdateVocabDto): Promise<Vocab> {
    const vocab = await this.findOne(id);

    Object.assign(vocab, updateVocabDto);

    return this.vocabRepository.save(vocab);
  }

  async remove(id: number): Promise<void> {
    const vocab = await this.findOne(id);

    await this.vocabRepository.remove(vocab);
  }

  async findVocabsByKeyword(userId: number, keyword: string) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const vocabs = await this.vocabRepository
      .createQueryBuilder('vocab')
      .innerJoin('vocab.topic', 'topic')
      .innerJoin('topic.language', 'language')
      .where('language.id = :languageId', { languageId })
      .andWhere('vocab.word LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();

    return vocabs;
  }

  async findAllByTopic(topicId: number) {
    return this.vocabRepository.find({
      where: { topic: { id: topicId } },
    });
  }
}
