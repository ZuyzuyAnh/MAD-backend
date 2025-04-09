import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamType } from './entities/exam.entity';
import { PaginateDto } from '../common/dto/paginate.dto';
import EntityNotFoundException from '../exception/notfound.exception';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create({
      ...createExamDto,
    });

    return await this.examRepository.save(exam);
  }

  async findAll(
    paginateDto: PaginateDto,
    type?: ExamType,
    languageId?: number,
    week?: number,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.language', 'language');

    if (type) {
      queryBuilder.andWhere('exam.type = :type', { type });
    }

    if (languageId) {
      queryBuilder.andWhere('exam.languageId = :languageId', { languageId });
    }

    if (week) {
      queryBuilder.andWhere('exam.week = :week', { week });
    }

    const total = await queryBuilder.getCount();

    const exams = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exam.createdAt', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: exams,
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

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['language', 'questions'],
    });

    if (!exam) {
      throw new EntityNotFoundException('exam', 'id', id);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);

    Object.assign(exam, updateExamDto);

    return this.examRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const exam = await this.findOne(id);

    // Lấy id của exam để sau này sử dụng
    const examId = exam.id;

    // Xóa liên kết với các câu hỏi nhưng không xóa câu hỏi
    if (exam.questions && exam.questions.length > 0) {
      // Sử dụng query builder để cập nhật các câu hỏi, đặt examId = null
      await this.examRepository.manager
        .createQueryBuilder()
        .update('questions')
        .set({ examId: null })
        .where('examId = :examId', { examId })
        .execute();
    }

    // Xóa bài kiểm tra
    await this.examRepository.remove(exam);
  }
}
