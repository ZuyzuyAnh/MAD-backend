import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseResult } from './entities/exercise-result.entity';
import { ExerciseResultsController } from './exercise-results.controller';
import { ExerciseResultsService } from './exercise-results.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseResult])],
  controllers: [ExerciseResultsController],
  providers: [ExerciseResultsService],
  exports: [ExerciseResultsService],
})
export class ExerciseResultsModule {}
