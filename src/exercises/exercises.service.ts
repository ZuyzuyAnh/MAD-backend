import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);
    return this.exerciseRepository.save(exercise);
  }

  async findAll(
    paginateDto: PaginateDto,
    languageId?: number,
    type?: string,
    active?: boolean,
  ) {
    const { page, limit } = paginateDto;

    const queryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.language', 'language')
      .leftJoinAndSelect('exercise.media', 'media');

    if (languageId) {
      queryBuilder.andWhere('exercise.language_id = :languageId', {
        languageId,
      });
    }

    if (type) {
      queryBuilder.andWhere('exercise.type = :type', { type });
    }

    if (active !== undefined) {
      queryBuilder.andWhere('exercise.active = :active', { active });
    }

    const total = await queryBuilder.getCount();

    const exercises = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('exercise.created_at', 'DESC')
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data: exercises,
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

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['language', 'media'],
    });

    if (!exercise) {
      throw new NotfoundException('exercise', 'id', id);
    }

    return exercise;
  }

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    const exercise = await this.findOne(id);

    Object.assign(exercise, updateExerciseDto);

    return this.exerciseRepository.save(exercise);
  }

  async remove(id: number): Promise<void> {
    const exercise = await this.findOne(id);
    await this.exerciseRepository.remove(exercise);
  }
}
