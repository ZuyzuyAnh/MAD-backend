import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user_achievements.entity';
import { ExerciseResultsModule } from '../exercise_results/exercise-results.module';
import { ProgressModule } from '../progress/progress.module';
import { VocabTopicProgressModule } from '../vocab_topic_progress/vocab_topic_progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, UserAchievement]),
    ExerciseResultsModule,
    ProgressModule,
    VocabTopicProgressModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
