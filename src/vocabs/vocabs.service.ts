import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vocab, VocabDifficulty } from './entities/vocab.entity';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { PaginateDto } from '../utils/dto/paginate.dto';
import NotfoundException from '../exception/notfound.exception';

@Injectable()
export class VocabsService {
  constructor(
    @InjectRepository(Vocab)
    private vocabRepository: Repository<Vocab>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async create(createVocabDto: CreateVocabDto, image?: Express.Multer.File) {
    const vocab = this.vocabRepository.create(createVocabDto);

    if (image) {
      vocab.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    } else if (createVocabDto.imageUrl) {
      vocab.imageUrl = createVocabDto.imageUrl;
    }

    return this.vocabRepository.save(vocab);
  }

  async findAll(
    paginateDto: PaginateDto,
    word?: string,
    topicId?: number,
    difficulty?: VocabDifficulty,
  ) {
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

    if (difficulty) {
      if (word || topicId) {
        queryBuilder.andWhere('vocab.difficulty = :difficulty', { difficulty });
      } else {
        queryBuilder.where('vocab.difficulty = :difficulty', { difficulty });
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

  async findOne(id: number) {
    const vocab = await this.vocabRepository.findOneBy({ id });

    if (!vocab) {
      throw new NotfoundException('vocabulary', 'id', id);
    }

    return vocab;
  }

  async update(
    id: number,
    updateVocabDto: UpdateVocabDto,
    image?: Express.Multer.File,
  ) {
    const vocab = await this.findOne(id);

    if (image) {
      updateVocabDto.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    }

    Object.assign(vocab, updateVocabDto);
    return this.vocabRepository.save(vocab);
  }

  async remove(id: number) {
    const vocab = await this.findOne(id);
    return this.vocabRepository.remove(vocab);
  }
}
