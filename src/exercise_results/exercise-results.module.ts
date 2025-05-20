import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseResult } from './entities/exercise-result.entity';
import { ExerciseResultsController } from './exercise-results.controller';
import { ExerciseResultsService } from './exercise-results.service';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseResult]), ProgressModule],
  controllers: [ExerciseResultsController],
  providers: [ExerciseResultsService],
  exports: [ExerciseResultsService],
})
export class ExerciseResultsModule {}
