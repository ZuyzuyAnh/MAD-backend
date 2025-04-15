import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseResultsController } from './exercise-results.controller';
import { ExerciseResultsService } from './exercise-results.service';

describe('ExerciseResultsController', () => {
  let controller: ExerciseResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExerciseResultsController],
      providers: [ExerciseResultsService],
    }).compile();

    controller = module.get<ExerciseResultsController>(ExerciseResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
