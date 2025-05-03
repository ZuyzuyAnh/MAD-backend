import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamType } from './entities/exam.entity';
import { LanguagesService } from 'src/languages/languages.service';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { ProgressService } from 'src/progress/progress.service';
import { ExamResultsService } from 'src/exam_results/exam_results.service';
import { VocabTopicsService } from 'src/vocab_topics/vocab_topics.service';
import { ExamSectionsService } from 'src/exam_sections/exam_sections.service';
import { ExamSingleQuestionsService } from 'src/exam_single_questions/exam_single_questions.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly languageService: LanguagesService,
    private readonly progressService: ProgressService,
    private readonly examResultService: ExamResultsService,
    private readonly vocabTopicService: VocabTopicsService,
    private readonly examSectionService: ExamSectionsService,
    private readonly examSingleQuestionService: ExamSingleQuestionsService,
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
      .select(['exam.id', 'exam.title', 'exam.type', 'examResults.score'])
      .innerJoin('exam.language', 'language')
      .leftJoin('exam.examResults', 'examResults')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exam.type = :type', { type });

    const total = await queryBuilder.getCount();

    const exams = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    const examWithQuestionCount = await Promise.all(
      exams.map(async (exam) => {
        console.log(exam.id);

        const singleQuestionCount =
          await this.examSingleQuestionService.countByExamId(exam.id);

        const multipleChoiceQuestionCount =
          await this.examSectionService.countSectionItemsByExamId(exam.id);

        return {
          ...exam,
          numberOfQuestions: singleQuestionCount + multipleChoiceQuestionCount,
        };
      }),
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: examWithQuestionCount,
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
        'examSingleQuestions.question',
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

    const vocabGameData =
      await this.vocabTopicService.countCompletedAndTotalOfGame(userId);

    return {
      weeklyExams: {
        total: numberOfWeeklyExams,
        completed: numberOfCompletedWeeklyExams,
      },
      comprehensiveExams: {
        total: numberOfComprehensiveExams,
        completed: numberOfCompletedComprehensiveExams,
      },
      vocabGames: vocabGameData,
    };
  }

  async countCompletedExams(
    userId: number,
    languageId: number,
    type: ExamType,
  ) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const queryBuilder = this.examRepository
      .createQueryBuilder('exam')
      .innerJoin('exam.language', 'language')
      .leftJoin('exam.examResults', 'examResults')
      .innerJoin('examResults.progress', 'progress')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exam.type = :type', { type })
      .andWhere('progress.id = :progressId', {
        progressId: progress.id,
      });
    console.log(queryBuilder.getSql());

    return queryBuilder.getCount();
  }

  async countExamsByType(languageId: number, type: ExamType) {
    const count = await this.examRepository
      .createQueryBuilder('exam')
      .where('exam.languageId = :languageId', { languageId })
      .andWhere('exam.type = :type', { type })
      .getCount();

    return count;
  }

  async getCompletedAmount(userId: number) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const total = await this.examRepository.countBy({
      languageId: progress.language.id,
    });

    const completed = await this.examResultService.countCompletedExams(
      progress.id,
    );

    return {
      total,
      completed,
    };
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
