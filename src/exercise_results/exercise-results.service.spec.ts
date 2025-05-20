import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseResultsService } from './exercise-results.service';

describe('ExerciseResultsService', () => {
  let service: ExerciseResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExerciseResultsService],
    }).compile();

    service = module.get<ExerciseResultsService>(ExerciseResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
