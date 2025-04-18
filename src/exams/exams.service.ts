import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamType } from './entities/exam.entity';
import { LanguagesService } from 'src/languages/languages.service';
import { VocabGamesService } from 'src/vocab_games/vocab_games.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly languageService: LanguagesService,
    private readonly vocabGameService: VocabGamesService,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create(createExamDto);
    return this.examRepository.save(exam);
  }

  async findAll(paginateDto: PaginateDto, userId: number, type: ExamType) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const { page, limit } = paginateDto;

    const queryBuilder = this.examRepository
      .createQueryBuilder('exam')
      .select(['exam.id', 'exam.title', 'exam.type', 'exerciseResult.score'])
      .innerJoin('exam.language', 'language')
      .leftJoinAndSelect('exam.exerciseResults', 'exerciseResult')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exam.type = :type', { type });

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
      relations: [
        'questions',
        'examSections',
        'examSections.examSectionItems',
        'examSections.examSectionItems.question',
      ],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async getExamsOverview(userId: number) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const numberOfWeeklyExams = await this.countExamsByType(
      languageId,
      ExamType.WEEKLY,
    );

    const numberOfComprehensiveExams = await this.countExamsByType(
      languageId,
      ExamType.COMPREHENSIVE,
    );

    const numberOfCompletedWeeklyExams = await this.countCompletedExams(
      userId,
      languageId,
      ExamType.WEEKLY,
    );

    const numberOfCompletedComprehensiveExams = await this.countCompletedExams(
      userId,
      languageId,
      ExamType.COMPREHENSIVE,
    );

    const vocabGames = await this.vocabGameService.getVocabGameOverview(userId);

    return {
      weeklyExams: {
        total: numberOfWeeklyExams,
        completed: numberOfCompletedWeeklyExams,
      },
      comprehensiveExams: {
        total: numberOfComprehensiveExams,
        completed: numberOfCompletedComprehensiveExams,
      },
      vocabGames,
    };
  }

  async countCompletedExams(
    userId: number,
    languageId: number,
    type: ExamType,
  ) {
    const count = await this.examRepository
      .createQueryBuilder('exam')
      .innerJoinAndSelect('exam.language', 'language')
      .leftJoinAndSelect('exam.exerciseResults', 'exerciseResult')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exerciseResult.userId = :userId', { userId })
      .andWhere('exam.type = :type', { type })
      .getCount();

    return count;
  }

  async countExamsByType(languageId: number, type: ExamType) {
    const count = await this.examRepository
      .createQueryBuilder('exam')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exam.type = :type', { type })
      .getCount();

    return count;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const exam = await this.findOne(id);
    await this.examRepository.remove(exam);
  }
}
