import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Vocab, VocabDifficulty } from './entities/vocab.entity';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { PaginateDto } from '../common/dto/paginate.dto';
import NotfoundException from '../exception/notfound.exception';
import { VocabTopicProgress } from 'src/vocab_topic_progress/entities/vocab_topic_progress.entity';
import EntityNotFoundException from '../exception/notfound.exception';
import { Language } from 'src/languages/entities/language.entity';
import { LanguagesService } from 'src/languages/languages.service';

/**
 * Service xử lý các thao tác với từ vựng
 */
@Injectable()
export class VocabsService {
  constructor(
    @InjectRepository(Vocab)
    private vocabRepository: Repository<Vocab>,
    private uploadFileService: UploadFileService,
    private languageService: LanguagesService,
  ) {}

  async create(
    createVocabDto: CreateVocabDto,
    image?: Express.Multer.File,
  ): Promise<Vocab> {
    const vocab = this.vocabRepository.create({
      ...createVocabDto,
      topic: { id: createVocabDto.topicId },
    });

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

  async findRandomVocabsForUser(userId: number) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const randomVocabs = this.vocabRepository
      .createQueryBuilder('vocab')
      .innerJoin('vocab.topic', 'topic')
      .innerJoin('topic.language', 'language')
      .where('language.id = :languageId', { languageId })
      .limit(20)
      .orderBy('RAND()')
      .getMany();

    return randomVocabs;
  }

  async findOne(id: number): Promise<Vocab> {
    // Tìm từ vựng theo ID
    const vocab = await this.vocabRepository.findOneBy({ id });

    // Kiểm tra nếu không tìm thấy
    if (!vocab) {
      throw new NotfoundException('vocabulary', 'id', id);
    }

    return vocab;
  }

  async update(
    id: number,
    updateVocabDto: UpdateVocabDto,
    image?: Express.Multer.File,
  ): Promise<Vocab> {
    // Tìm từ vựng cần cập nhật
    const vocab = await this.findOne(id);

    // Xử lý hình ảnh nếu có
    if (image) {
      updateVocabDto.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    }

    // Cập nhật thông tin
    Object.assign(vocab, updateVocabDto);

    // Lưu và trả về kết quả
    return this.vocabRepository.save(vocab);
  }

  async remove(id: number): Promise<void> {
    // Tìm từ vựng cần xóa
    const vocab = await this.findOne(id);

    // Xóa từ vựng
    await this.vocabRepository.remove(vocab);
  }

  async findVocabsByKeyword(
    userId: number,
    keyword: string,
    paginateDto: PaginateDto,
  ) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const { page, limit } = paginateDto;

    const queryBuilder = this.vocabRepository
      .createQueryBuilder('vocab')
      .where('vocab.word LIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('vocab.languageId = :languageId', { languageId })
      .orWhere('vocab.definition LIKE :keyword', { keyword: `%${keyword}%` });

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
}
