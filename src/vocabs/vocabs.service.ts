import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { Vocab, VocabDifficulty } from './entities/vocab.entity';
import { CreateVocabDto } from './dto/create-vocab.dto';
import { UpdateVocabDto } from './dto/update-vocab.dto';
import { UploadFileService } from '../aws/uploadfile.s3.service';
import { PaginateDto } from '../common/dto/paginate.dto';
import NotfoundException from '../exception/notfound.exception';
import { VocabTopicProgress } from 'src/vocab_topics/entities/vocab_topic_progress.entity';
import EntityNotFoundException from '../exception/notfound.exception';

/**
 * Service xử lý các thao tác với từ vựng
 */
@Injectable()
export class VocabsService {
  constructor(
    @InjectRepository(Vocab)
    private vocabRepository: Repository<Vocab>,
    private uploadFileService: UploadFileService,
  ) {}

  /**
   * Tạo một từ vựng mới
   * @param createVocabDto - Thông tin cần để tạo một từ vựng mới
   * @param image - File hình ảnh minh họa cho từ vựng (nếu có)
   * @returns Thông tin từ vựng đã tạo
   */
  async create(
    createVocabDto: CreateVocabDto,
    image?: Express.Multer.File,
  ): Promise<Vocab> {
    // Tạo đối tượng từ vựng mới
    const vocab = this.vocabRepository.create({
      ...createVocabDto,
      topic: { id: createVocabDto.topicId },
    });

    // Xử lý hình ảnh nếu có
    if (image) {
      vocab.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    } else if (createVocabDto.imageUrl) {
      vocab.imageUrl = createVocabDto.imageUrl;
    }

    // Lưu và trả về kết quả
    return this.vocabRepository.save(vocab);
  }

  /**
   * Lấy danh sách từ vựng với phân trang và bộ lọc tùy chọn
   * @param paginateDto - Thông tin phân trang
   * @param word - Từ vựng cần tìm kiếm (tùy chọn)
   * @param topicId - ID chủ đề để lọc (tùy chọn)
   * @param difficulty - Độ khó để lọc (tùy chọn)
   * @returns Danh sách từ vựng và thông tin phân trang
   */
  async findAll(
    paginateDto: PaginateDto,
    word?: string,
    topicId?: number,
    difficulty?: VocabDifficulty,
  ) {
    const { page, limit } = paginateDto;

    // Xây dựng query với các điều kiện lọc
    const queryBuilder = this.vocabRepository.createQueryBuilder('vocab');

    // Áp dụng các điều kiện tìm kiếm
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

    // Đếm tổng số bản ghi thỏa điều kiện
    const total = await queryBuilder.getCount();

    // Lấy dữ liệu theo phân trang
    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocab.createdAt', 'DESC')
      .getMany();

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(total / limit);

    // Trả về kết quả và metadata phân trang
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

  /**
   * Tìm một từ vựng theo ID
   * @param id - ID của từ vựng cần tìm
   * @returns Thông tin từ vựng
   * @throws NotfoundException nếu không tìm thấy
   */
  async findOne(id: number): Promise<Vocab> {
    // Tìm từ vựng theo ID
    const vocab = await this.vocabRepository.findOneBy({ id });

    // Kiểm tra nếu không tìm thấy
    if (!vocab) {
      throw new NotfoundException('vocabulary', 'id', id);
    }

    return vocab;
  }

  /**
   * Cập nhật thông tin từ vựng
   * @param id - ID của từ vựng cần cập nhật
   * @param updateVocabDto - Thông tin cần cập nhật
   * @param image - File hình ảnh mới (nếu có)
   * @returns Thông tin từ vựng sau khi cập nhật
   */
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

  /**
   * Xóa một từ vựng
   * @param id - ID của từ vựng cần xóa
   * @returns void
   */
  async remove(id: number): Promise<void> {
    // Tìm từ vựng cần xóa
    const vocab = await this.findOne(id);

    // Xóa từ vựng
    await this.vocabRepository.remove(vocab);
  }
}
