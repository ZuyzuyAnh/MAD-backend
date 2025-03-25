import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseQuestionsController } from './exercise-questions.controller';
import { ExerciseQuestionsService } from './exercise-questions.service';

describe('ExerciseQuestionsController', () => {
  let controller: ExerciseQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseQuestionsController],
      providers: [ExerciseQuestionsService],
    }).compile();

    controller = module.get<ExerciseQuestionsController>(
      ExerciseQuestionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
