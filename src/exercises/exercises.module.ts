import { Module } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './entities/exercise.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ExerciseResultsModule } from 'src/exercise_results/exercise-results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Exercise]),
    LanguagesModule,
    ExerciseResultsModule,
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
