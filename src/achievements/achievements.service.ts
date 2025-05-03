import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user_achievements.entity';
import { ExerciseResultsService } from 'src/exercise_results/exercise-results.service';
import { ProgressService } from 'src/progress/progress.service';
import { VocabTopicProgressService } from 'src/vocab_topic_progress/vocab_topic_progress.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(UserAchievement)
    private userAchievementRepository: Repository<UserAchievement>,
    private exerciseResultService: ExerciseResultsService,
    private progressService: ProgressService,
    private vocabTopicProgressService: VocabTopicProgressService,
    private notificationsService: NotificationsService,
  ) {}

  // CRUD Operations
  async create(
    createAchievementDto: CreateAchievementDto,
  ): Promise<Achievement> {
    const achievement = this.achievementRepository.create(createAchievementDto);
    return this.achievementRepository.save(achievement);
  }

  async findAll(): Promise<Achievement[]> {
    return this.achievementRepository.find();
  }

  async findOne(id: number): Promise<Achievement> {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
    });
    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }
    return achievement;
  }

  async update(
    id: number,
    updateAchievementDto: UpdateAchievementDto,
  ): Promise<Achievement> {
    const achievement = await this.findOne(id);
    this.achievementRepository.merge(achievement, updateAchievementDto);
    return this.achievementRepository.save(achievement);
  }

  async remove(id: number): Promise<void> {
    const achievement = await this.findOne(id);
    await this.achievementRepository.remove(achievement);
  }

  // User achievement methods
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.userAchievementRepository.find({
      where: { userId },
      relations: ['achievement'],
    });
  }

  // Event handlers
  @OnEvent('exercise.completed')
  async handleExerciseCompletedEvent(payload: {
    userId: number;
    exerciseId: number;
  }) {
    const progress = await this.progressService.findCurrentActiveProgress(
      payload.userId,
    );

    const exerciseCount =
      await this.exerciseResultService.getNumberOfExerciseCompleted(
        progress.id,
      );

    const achievements = await this.achievementRepository.find({
      where: {
        triggerCondition: 'COMPLETE_EXERCISES',
        conditionValue: LessThanOrEqual(exerciseCount),
      },
    });

    for (const achievement of achievements) {
      await this.unlockAchievementIfNotExists(payload.userId, achievement.id);
    }
  }

  @OnEvent('vocab.learned')
  async handleVocabLearnedEvent(payload: { userId: number; vocabId: number }) {
    const progress = await this.progressService.findCurrentActiveProgress(
      payload.userId,
    );

    const vocabCount = await this.vocabTopicProgressService.countByProgress(
      progress.id,
    );

    const achievements = await this.achievementRepository.find({
      where: {
        triggerCondition: 'LEARN_VOCABS',
        conditionValue: LessThanOrEqual(vocabCount),
      },
    });

    for (const achievement of achievements) {
      await this.unlockAchievementIfNotExists(payload.userId, achievement.id);
    }
  }

  private async unlockAchievementIfNotExists(
    userId: number,
    achievementId: number,
  ): Promise<void> {
    const existingAchievement = await this.userAchievementRepository.findOne({
      where: {
        userId,
        achievementId,
      },
    });

    if (!existingAchievement) {
      await this.userAchievementRepository.save({
        userId,
        achievementId,
      });
       // Lấy thông tin thành tựu
    const achievement = await this.achievementRepository.findOne({
      where: { id: achievementId },
    });

    // Gửi thông báo cho người dùng
    if (achievement) {
      await this.notificationsService.createAchievementNotification(
        userId,
        achievement.title
      );
    } else {
      console.error(`Achievement with ID ${achievementId} not found.`);
    }
      console.log(`User ${userId} unlocked achievement ${achievementId}`);
    }
  }
}
