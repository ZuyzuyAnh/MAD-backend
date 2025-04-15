import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Progress } from './entities/progress.entity';
import { UsersModule } from '../users/users.module';
import { ExerciseResultsModule } from 'src/exercise_results/exercise-results.module';
import { ExercisesModule } from 'src/exercises/exercises.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress]),
    ExerciseResultsModule,
    ExercisesModule,
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
