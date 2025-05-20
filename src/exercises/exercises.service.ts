import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise, ExerciseType } from './entities/exercise.entity';
import NotfoundException from '../exception/notfound.exception';
import { PaginateDto } from '../common/dto/paginate.dto';
import { ExerciseResultsService } from 'src/exercise_results/exercise-results.service';
import { LanguagesService } from 'src/languages/languages.service';
import { ProgressService } from 'src/progress/progress.service';
import { UploadFileService } from 'src/aws/uploadfile.s3.service';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    private readonly exerciseResultService: ExerciseResultsService,
    private readonly languageService: LanguagesService,
    private readonly progressServicce: ProgressService,
    private readonly fileUploadService: UploadFileService,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepository.create(createExerciseDto);

    return this.exerciseRepository.save(exercise);
  }

  async findAll(
    paginateDto: PaginateDto,
    userId: number,
    type: string,
    difficulty?: string,
  ) {
    const languageId =
      await this.languageService.getLanguageIdForCurrentUser(userId);

    const { page, limit } = paginateDto;

    const queryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .select([
        'exercise.id',
        'exercise.title',
        'exerciseResult.score',
        'exercise.difficulty',
      ])
      .innerJoin('exercise.language', 'language')
      .leftJoinAndSelect('exercise.exerciseResults', 'exerciseResult')
      .andWhere('exercise.language_id = :languageId', { languageId })
      .andWhere('exercise.type = :type', { type });

    if (difficulty) {
      queryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty,
      });
    }

    const total = await queryBuilder.getCount();

    const exercises = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
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
      relations: ['questions'],
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

  async getNumberOfExercises(
    languageId: number,
    type?: string,
    difficulty?: string,
  ): Promise<number> {
    const queryBuilder = this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.language_id = :languageId', { languageId });

    if (type) {
      queryBuilder.andWhere('exercise.type = :type', { type });
    }

    if (difficulty) {
      queryBuilder.andWhere('exercise.difficulty = :difficulty', {
        difficulty,
      });
    }

    return queryBuilder.getCount();
  }

  async countNumberOfExercises(type: ExerciseType) {
    const count = await this.exerciseRepository
      .createQueryBuilder('exercise')
      .where('exercise.type = :type', { type })
      .getCount();

    return count;
  }

  async countCompletedExercises(userId: number) {
    const progress =
      await this.progressServicce.findCurrentActiveProgress(userId);

    const total = await this.exerciseRepository.countBy({
      languageId: progress.language.id,
    });

    const completed =
      await this.exerciseResultService.getNumberOfExerciseCompleted(
        progress.id,
      );

    return {
      total,
      completed,
    };
  }

  async countNumberOfQuestions(exerciseId: number) {
    const exercise = await this.exerciseRepository.findOne({
      where: { id: exerciseId },
      relations: ['questions'],
    });

    if (!exercise) {
      throw new NotfoundException('exercise', 'id', exerciseId);
    }

    return exercise.questions.length;
  }

  async getExerciseOverView(userId: number) {
    const progress =
      await this.progressServicce.findCurrentActiveProgress(userId);

    const numberOfGrammar = await this.countNumberOfExercises(
      ExerciseType.GRAMMAR,
    );
    const numberOfListening = await this.countNumberOfExercises(
      ExerciseType.LISTENING,
    );
    const numberOfSpeaking = await this.countNumberOfExercises(
      ExerciseType.SPEAKING,
    );

    const completedGrammar =
      await this.exerciseResultService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.GRAMMAR,
      );

    const completedListening =
      await this.exerciseResultService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.LISTENING,
      );

    const completedSpeaking =
      await this.exerciseResultService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.SPEAKING,
      );

    return {
      progress: {
        grammar: {
          completed: completedGrammar,
          total: numberOfGrammar,
        },
        listening: {
          completed: completedListening,
          total: numberOfListening,
        },
        speaking: {
          completed: completedSpeaking,
          total: numberOfSpeaking,
        },
      },
    };
  }
}
