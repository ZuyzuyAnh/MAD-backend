import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReport } from './entities/post-report.entity';
import { CreatePostReportDto } from './dto/create-post-report.dto';
import { UpdatePostReportDto } from './dto/update-post-report.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import EntityNotFoundException from 'src/exception/notfound.exception';

@Injectable()
export class PostReportsService {
  constructor(
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
  ) {}

  async create(
    createPostReportDto: CreatePostReportDto,
    userId: number,
  ): Promise<PostReport> {
    const report = this.postReportRepository.create({
      ...createPostReportDto,
      userId,
    });
    return this.postReportRepository.save(report);
  }

  async findAll(
    paginateDto: PaginateDto,
  ): Promise<{ data: PostReport[]; meta: any }> {
    const { page, limit } = paginateDto;

    const [reports, total] = await this.postReportRepository.findAndCount({
      relations: ['post', 'user'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: reports,
      meta: {
        totalItems: total,
        itemCount: reports.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<PostReport> {
    const report = await this.postReportRepository.findOne({
      where: { id },
      relations: ['post', 'user'],
    });

    if (!report) {
      throw new EntityNotFoundException('post report', 'id', id);
    }

    return report;
  }

  async update(
    id: number,
    updatePostReportDto: UpdatePostReportDto,
  ): Promise<PostReport> {
    const report = await this.findOne(id);

    Object.assign(report, updatePostReportDto);

    return this.postReportRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const report = await this.findOne(id);
    await this.postReportRepository.remove(report);
  }

  async findByPostId(postId: number): Promise<PostReport[]> {
    return this.postReportRepository.find({
      where: { postId },
      relations: ['user'],
    });
  }

  async findByUserId(
    userId: number,
    paginateDto: PaginateDto,
  ): Promise<{ data: PostReport[]; meta: any }> {
    const { page, limit } = paginateDto;

    const [reports, total] = await this.postReportRepository.findAndCount({
      where: { userId },
      relations: ['post'],
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: reports,
      meta: {
        totalItems: total,
        itemCount: reports.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
