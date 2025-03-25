import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseQuestionsService } from './exercise-questions.service';

describe('ExerciseQuestionsService', () => {
  let service: ExerciseQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseQuestionsService],
    }).compile();

    service = module.get<ExerciseQuestionsService>(ExerciseQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
