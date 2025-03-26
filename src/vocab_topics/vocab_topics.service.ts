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

/**
 * Service xử lý các thao tác liên quan đến chủ đề từ vựng
 */
@Injectable()
export class VocabTopicsService {
  constructor(
    @InjectRepository(VocabTopic)
    private readonly vocabTopicRepository: Repository<VocabTopic>,
    private readonly uploadFileService: UploadFileService,
  ) {}

  /**
   * Tạo một chủ đề từ vựng mới
   * @param createVocabTopicDto - Dữ liệu để tạo chủ đề từ vựng
   * @param image - File hình ảnh cho chủ đề (tùy chọn)
   * @returns Chủ đề từ vựng đã được tạo
   * @throws DuplicateEntityException nếu chủ đề đã tồn tại
   */
  async create(
    createVocabTopicDto: CreateVocabTopicDto,
    image?: Express.Multer.File,
  ): Promise<VocabTopic> {
    // Kiểm tra xem chủ đề đã tồn tại chưa
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

    // Tạo chủ đề mới
    const vocabTopic = this.vocabTopicRepository.create({
      topic: createVocabTopicDto.topic,
      level: createVocabTopicDto.level,
      language: { id: createVocabTopicDto.languageId },
    });

    // Xử lý hình ảnh nếu có
    if (image) {
      vocabTopic.imageUrl =
        await this.uploadFileService.uploadFileToPublicBucket(image);
    } else if (createVocabTopicDto.imageUrl) {
      vocabTopic.imageUrl = createVocabTopicDto.imageUrl;
    }

    // Lưu và trả về chủ đề mới
    return this.vocabTopicRepository.save(vocabTopic);
  }

  /**
   * Lấy danh sách các chủ đề từ vựng với phân trang và lọc
   * @param paginateDto - Thông tin phân trang
   * @param topic - Từ khóa tìm kiếm theo tên chủ đề (tùy chọn)
   * @param languageId - Lọc theo ID ngôn ngữ (tùy chọn)
   * @returns Danh sách chủ đề từ vựng và thông tin phân trang
   */
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

    // Xây dựng query với joins và conditions
    const queryBuilder = this.vocabTopicRepository
      .createQueryBuilder('vocab_topic')
      .leftJoinAndSelect('vocab_topic.language', 'language');

    // Thêm điều kiện tìm kiếm nếu có
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

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await queryBuilder.getCount();

    // Lấy dữ liệu theo phân trang
    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vocab_topic.topic', 'ASC') // Sắp xếp theo tên chủ đề
      .getMany();

    // Tính toán metadata phân trang
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

  /**
   * Tìm một chủ đề từ vựng theo ID
   * @param id - ID của chủ đề từ vựng cần tìm
   * @returns Chủ đề từ vựng đã tìm thấy
   * @throws NotfoundException nếu không tìm thấy chủ đề
   */
  async findOne(id: number): Promise<VocabTopic> {
    // Tìm chủ đề với thông tin ngôn ngữ
    const vocabTopic = await this.vocabTopicRepository.findOne({
      where: { id },
      relations: ['language'],
    });

    // Kiểm tra nếu không tìm thấy
    if (!vocabTopic) {
      throw new NotfoundException('vocabulary topic', 'id', id);
    }

    return vocabTopic;
  }

  /**
   * Cập nhật thông tin chủ đề từ vựng
   * @param id - ID của chủ đề cần cập nhật
   * @param updateVocabTopicDto - Dữ liệu cập nhật
   * @param image - File hình ảnh mới (tùy chọn)
   * @returns Chủ đề từ vựng sau khi cập nhật
   * @throws NotfoundException nếu không tìm thấy chủ đề
   * @throws DuplicateEntityException nếu tên chủ đề đã tồn tại
   */
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

  /**
   * Xóa một chủ đề từ vựng
   * @param id - ID của chủ đề cần xóa
   * @returns Chủ đề đã xóa
   * @throws NotfoundException nếu không tìm thấy chủ đề
   * @throws ConflictException nếu chủ đề đang được sử dụng bởi các từ vựng
   */
  async remove(id: number): Promise<VocabTopic> {
    const vocabTopic = await this.findOne(id);

    return this.vocabTopicRepository.remove(vocabTopic);
  }
}
