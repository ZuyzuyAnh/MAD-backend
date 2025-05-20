import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { PaginateDto } from '../common/dto/paginate.dto';
import EntityNotFoundException from '../exception/notfound.exception';
import { ExercisesService } from 'src/exercises/exercises.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create({
      ...createQuestionDto,
    });

    return await this.questionRepository.save(question);
  }

  async findAll(
    paginateDto: PaginateDto,
    exerciseId?: number,
    examId?: number,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.exercise', 'exercise')
      .leftJoinAndSelect('question.exam', 'exam')
      .leftJoinAndSelect('question.language', 'language');

    if (exerciseId) {
      queryBuilder.andWhere('question.exerciseId = :exerciseId', {
        exerciseId,
      });
    }

    if (examId) {
      queryBuilder.andWhere('question.examId = :examId', { examId });
    }

    const total = await queryBuilder.getCount();

    const questions = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('question.createdAt', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: questions,
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

  async findOne(id: number): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['exercise', 'exam', 'language'],
    });

    if (!question) {
      throw new EntityNotFoundException('question', 'id', id);
    }

    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.findOne(id);

    Object.assign(question, updateQuestionDto);

    return this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
  }
}
