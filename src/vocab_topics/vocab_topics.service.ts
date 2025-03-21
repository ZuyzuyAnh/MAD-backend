import { Injectable } from '@nestjs/common';
import { CreateVocabTopicDto } from './dto/create-vocab_topic.dto';
import { UpdateVocabTopicDto } from './dto/update-vocab_topic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VocabTopic } from './entities/vocab_topic.entity';
import DuplicateEntityException from '../exception/duplicate-entity.exception';
import NotfoundException from '../exception/notfound.exception';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';
import { PaginateDto } from '../utils/dto/paginate.dto';

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
  ) {
    const existingTopic = await this.vocabTopicRepository.findOneBy({
      topic: createVocabTopicDto.topic,
      languageId: createVocabTopicDto.languageId,
    });

    if (existingTopic) {
      throw new DuplicateEntityException(
        'vocabulary topic',
        'topic',
        createVocabTopicDto.topic,
      );
    }

    const vocabTopic = this.vocabTopicRepository.create(createVocabTopicDto);

    if (image) {
      vocabTopic.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    } else if (createVocabTopicDto.imageUrl) {
      vocabTopic.imageUrl = createVocabTopicDto.imageUrl;
    }

    return this.vocabTopicRepository.save(vocabTopic);
  }

  async findAll(paginateDto: PaginateDto, topic?: string, languageId?: number) {
    const { page, limit } = paginateDto;

    const queryBuilder =
      this.vocabTopicRepository.createQueryBuilder('vocab_topic');

    if (topic) {
      queryBuilder.where('vocab_topic.topic LIKE :topic', {
        topic: `%${topic}%`,
      });
    }

    if (languageId) {
      queryBuilder.andWhere('vocab_topic.languageId = :languageId', {
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

  async findOne(id: number) {
    const vocabTopic = await this.vocabTopicRepository.findOneBy({ id });

    if (!vocabTopic) {
      throw new NotfoundException('vocabulary topic', 'id', id);
    }

    return vocabTopic;
  }

  async update(
    id: number,
    updateVocabTopicDto: UpdateVocabTopicDto,
    image?: Express.Multer.File,
  ) {
    const vocabTopic = await this.findOne(id);

    if (
      updateVocabTopicDto.topic &&
      updateVocabTopicDto.languageId &&
      (updateVocabTopicDto.topic !== vocabTopic.topic ||
        updateVocabTopicDto.languageId !== vocabTopic.languageId)
    ) {
      const existingTopic = await this.vocabTopicRepository.findOneBy({
        topic: updateVocabTopicDto.topic,
        languageId: updateVocabTopicDto.languageId,
      });

      if (existingTopic && existingTopic.id !== id) {
        throw new DuplicateEntityException(
          'vocabulary topic',
          'topic',
          updateVocabTopicDto.topic,
        );
      }
    }

    if (image) {
      updateVocabTopicDto.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    }

    Object.assign(vocabTopic, updateVocabTopicDto);
    return this.vocabTopicRepository.save(vocabTopic);
  }

  async remove(id: number) {
    const vocabTopic = await this.findOne(id);
    return this.vocabTopicRepository.remove(vocabTopic);
  }
}
