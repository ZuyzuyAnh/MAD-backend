import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseQuestionDto } from './dto/create-exercise-question.dto';
import { UpdateExerciseQuestionDto } from './dto/update-exercise-question.dto';
import { ExerciseQuestion } from './entities/exercise-question.entity';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';
import { UploadFileService } from '../aws/uploadfile.s3.service';

@Injectable()
export class ExerciseQuestionsService {
  constructor(
    @InjectRepository(ExerciseQuestion)
    private readonly questionRepository: Repository<ExerciseQuestion>,
    private readonly fileService: UploadFileService,
  ) {}

  async create(
    createDto: CreateExerciseQuestionDto,
    file?: Express.Multer.File,
  ): Promise<ExerciseQuestion> {
    const question = this.questionRepository.create({
      question: createDto.question,
      options: createDto.options,
      answer: createDto.answer,
      exercise: { id: createDto.exerciseId },
    });

    if (file) {
      question.mediaURL = await this.fileService.uploadFileToPublicBucket(file);
    } else if (createDto.mediaURL) {
      question.mediaURL = createDto.mediaURL;
    }

    return await this.questionRepository.save(question);
  }

  async findAll(paginateDto: PaginateDto, exerciseId?: number) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.exercise', 'exercise');

    if (exerciseId) {
      queryBuilder.where('exercise.id = :exerciseId', { exerciseId });
    }

    const total = await queryBuilder.getCount();

    const questions = await queryBuilder
      .orderBy('question.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
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

  async findAllByExerciseId(exerciseId: number): Promise<ExerciseQuestion[]> {
    return this.questionRepository.find({
      where: { exercise: { id: exerciseId } },
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ExerciseQuestion> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['exercise'],
    });

    if (!question) {
      throw new NotfoundException('exercise question', 'id', id);
    }

    return question;
  }

  async update(
    id: number,
    updateDto: UpdateExerciseQuestionDto,
    file?: Express.Multer.File,
  ): Promise<ExerciseQuestion> {
    const question = await this.findOne(id);

    if (updateDto.question) question.question = updateDto.question;
    if (updateDto.options) question.options = updateDto.options;
    if (updateDto.answer) question.answer = updateDto.answer;
    if (updateDto.exerciseId) {
      question.exercise = {
        id: updateDto.exerciseId,
      } as ExerciseQuestion['exercise'];
    }

    // Handle file upload for question media
    if (file) {
      question.mediaURL = await this.fileService.uploadFileToPublicBucket(file);
    } else if (updateDto.mediaURL !== undefined) {
      question.mediaURL = updateDto.mediaURL;
    }

    return await this.questionRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
  }
}
