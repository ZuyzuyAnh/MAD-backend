import { Test, TestingModule } from '@nestjs/testing';
import { ExamSingleQuestionsService } from './exam_single_questions.service';

describe('ExamSingleQuestionsService', () => {
  let service: ExamSingleQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamSingleQuestionsService],
    }).compile();

    service = module.get<ExamSingleQuestionsService>(ExamSingleQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
