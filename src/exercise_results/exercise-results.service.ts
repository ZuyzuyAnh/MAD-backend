import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateDto } from '../common/dto/paginate.dto';
import EntityNotFoundException from '../exception/notfound.exception';
import { ExerciseResult } from './entities/exercise-result.entity';
import { CreateExerciseResultDto } from './dto/create-exercise-result.dto';
import { UpdateExerciseResultDto } from './dto/update-exercise-result.dto';
import { ExerciseType } from 'src/exercises/entities/exercise.entity';
import { ProgressService } from 'src/progress/progress.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ExerciseResultsService {
  constructor(
    @InjectRepository(ExerciseResult)
    private exerciseResultRepository: Repository<ExerciseResult>,
    private progressService: ProgressService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrUpdate(
    userId: number,
    createExerciseResultDto: CreateExerciseResultDto,
  ): Promise<ExerciseResult> {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const existingResult = await this.findByUserAndExercise(
      progress.id,
      createExerciseResultDto.exerciseId,
    );

    if (existingResult) {
      existingResult.score = createExerciseResultDto.score || 0;
      return this.exerciseResultRepository.save(existingResult);
    }

    const exerciseResult = this.exerciseResultRepository.create({
      progressId: progress.id,
      exerciseId: createExerciseResultDto.exerciseId,
      score: createExerciseResultDto.score || 0,
    });

    this.eventEmitter.emit('exercise.completed', {
      userId,
      exerciseId: createExerciseResultDto.exerciseId,
    });

    return this.exerciseResultRepository.save(exerciseResult);
  }

  async findAll(
    paginateDto: PaginateDto,
    progressId?: number,
    exerciseId?: number,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.exerciseResultRepository
      .createQueryBuilder('exerciseResult')
      .leftJoinAndSelect('exerciseResult.progress', 'progress')
      .leftJoinAndSelect('exerciseResult.exercise', 'exercise')
      .leftJoinAndSelect('progress.user', 'user')
      .leftJoinAndSelect('progress.language', 'language');

    if (progressId) {
      queryBuilder.andWhere('exerciseResult.progressId = :progressId', {
        progressId,
      });
    }

    if (exerciseId) {
      queryBuilder.andWhere('exerciseResult.exerciseId = :exerciseId', {
        exerciseId,
      });
    }

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exerciseResult.createdAt', 'DESC')
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

  async findOne(id: number): Promise<ExerciseResult> {
    const exerciseResult = await this.exerciseResultRepository.findOne({
      where: { id },
      relations: ['progress', 'exercise', 'progress.user', 'progress.language'],
    });

    if (!exerciseResult) {
      throw new EntityNotFoundException('exercise result', 'id', id);
    }

    return exerciseResult;
  }

  async update(
    id: number,
    updateExerciseResultDto: UpdateExerciseResultDto,
  ): Promise<ExerciseResult> {
    const exerciseResult = await this.findOne(id);

    Object.assign(exerciseResult, updateExerciseResultDto);

    return this.exerciseResultRepository.save(exerciseResult);
  }

  async remove(id: number): Promise<void> {
    const exerciseResult = await this.findOne(id);
    await this.exerciseResultRepository.remove(exerciseResult);
  }

  async findByUserAndExercise(
    progressId: number,
    exerciseId: number,
  ): Promise<ExerciseResult | null> {
    const result = await this.exerciseResultRepository
      .createQueryBuilder('exerciseResult')
      .where('exerciseResult.progressId = :progressId', { progressId })
      .andWhere('exerciseResult.exerciseId = :exerciseId', { exerciseId })
      .orderBy('exerciseResult.createdAt', 'DESC')
      .getOne();

    return result;
  }

  async getNumberOfExerciseCompleted(
    progressId: number,
    type?: ExerciseType,
  ): Promise<number> {
    const queryBuilder = this.exerciseResultRepository
      .createQueryBuilder('exerciseResult')
      .where('exerciseResult.progressId = :progressId', { progressId });

    if (type) {
      queryBuilder
        .leftJoinAndSelect('exerciseResult.exercise', 'exercise')
        .andWhere('exercise.type = :type', { type });
    }

    const result = await queryBuilder.getCount();

    console.log(result);

    return result;
  }
}
