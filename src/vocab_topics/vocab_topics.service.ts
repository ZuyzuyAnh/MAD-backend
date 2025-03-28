import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVocabTopicDto } from './dto/create-vocab_topic.dto';
import { UpdateVocabTopicDto } from './dto/update-vocab_topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabTopic } from './entities/vocab_topic.entity';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';
import { PaginateDto } from '../common/dto/paginate.dto';

@Injectable()
export class VocabTopicsService {
  constructor(
    @InjectRepository(VocabTopic)
    private readonly vocabTopicRepository: Repository<VocabTopic>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(
    createVocabTopicDto: CreateVocabTopicDto,
    image?: Express.Multer.File,
  ): Promise<VocabTopic> {
    const existingTopic = await this.vocabTopicRepository.findOne({
      where: {
        topic: createVocabTopicDto.topic,
        language: { id: createVocabTopicDto.languageId },
      },
    });

    if (existingTopic) {
      throw new DuplicateEntityException(
        'vocabulary topic',
        'topic',
        createVocabTopicDto.topic,
      );
    }

    const vocabTopic = this.vocabTopicRepository.create({
      topic: createVocabTopicDto.topic,
      level: createVocabTopicDto.level,
      language: { id: createVocabTopicDto.languageId },
    });

    if (image) {
      vocabTopic.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    } else if (createVocabTopicDto.imageUrl) {
      vocabTopic.imageUrl = createVocabTopicDto.imageUrl;
    }

    return this.vocabTopicRepository.save(vocabTopic);
  }

  async findAll(
    paginateDto: PaginateDto,
    topic?: string,
    languageId?: number,
  ): Promise<{
    data: VocabTopic[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabTopicRepository
      .createQueryBuilder('vocab_topic')
      .leftJoinAndSelect('vocab_topic.language', 'language')
      .loadRelationCountAndMap('vocab_topic.totalVocabs', 'vocab_topic.vocabs');

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

    if (image) {
      updateVocabTopicDto.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    }

    Object.assign(vocabTopic, updateVocabTopicDto);

    return this.vocabTopicRepository.save(vocabTopic);
  }

  async remove(id: number): Promise<VocabTopic> {
    const vocabTopic = await this.findOne(id);

    return this.vocabTopicRepository.remove(vocabTopic);
  }
}
