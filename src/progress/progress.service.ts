import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import NotFoundException from '../exception/notfound.exception';
import { UsersService } from '../users/users.service';
import { Exercise, ExerciseType } from 'src/exercises/entities/exercise.entity';
import { ExercisesService } from 'src/exercises/exercises.service';
import { ExerciseResultsService } from 'src/exercise_results/exercise-results.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
    private exerciseService: ExercisesService,
    private exerciseResultsService: ExerciseResultsService,
  ) {}

  async create(userId: number, createProgressDto: CreateProgressDto) {
    const progress = this.progressRepository.create({
      ...createProgressDto,
      user: { id: userId },
      language: { id: createProgressDto.languageId },
    });

    return await this.progressRepository.save(progress);
  }

  async findOne(id: number) {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async findOneByUserId(userId: number) {
    const progress = await this.progressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async findByUserAndLanguage(userId: number, languageId: number) {
    const progress = await this.progressRepository.findOne({
      where: {
        user: { id: userId },
        language: { id: languageId },
      },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    const progress = await this.findOne(id);

    if (!progress) {
      throw new NotFoundException('progress', 'id', id);
    }

    Object.assign(progress, updateProgressDto);

    return this.progressRepository.save(progress);
  }

  async getExerciseStatisticForUser(userId: number) {
    const progress = await this.findOneByUserId(userId);

    if (!progress) {
      throw new NotFoundException('progress', 'userId', userId);
    }

    console.log(progress);

    const numberOfGrammar = await this.exerciseService.getNumberOfExercises(
      progress.language.id,
      ExerciseType.GRAMMAR,
    );

    const numberOfListening = await this.exerciseService.getNumberOfExercises(
      progress.language.id,
      ExerciseType.LISTENING,
    );

    const numberOfSpeaking = await this.exerciseService.getNumberOfExercises(
      progress.language.id,
      ExerciseType.SPEAKING,
    );

    const grammarExercisesCompleted =
      await this.exerciseResultsService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.GRAMMAR,
      );

    const listeningExercisesCompleted =
      await this.exerciseResultsService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.LISTENING,
      );

    const speakingExercisesCompleted =
      await this.exerciseResultsService.getNumberOfExerciseCompleted(
        progress.id,
        ExerciseType.SPEAKING,
      );

    return {
      grammarCompletionRate: grammarExercisesCompleted / numberOfGrammar,
      listeningCompletionRate: listeningExercisesCompleted / numberOfListening,
      speakingCompletionRate: speakingExercisesCompleted / numberOfSpeaking,
    };
  }
}
