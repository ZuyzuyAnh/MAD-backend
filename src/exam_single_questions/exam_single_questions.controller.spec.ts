import { Test, TestingModule } from '@nestjs/testing';
import { ExamSingleQuestionsController } from './exam_single_questions.controller';
import { ExamSingleQuestionsService } from './exam_single_questions.service';

describe('ExamSingleQuestionsController', () => {
  let controller: ExamSingleQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSingleQuestionsController],
      providers: [ExamSingleQuestionsService],
    }).compile();

    controller = module.get<ExamSingleQuestionsController>(ExamSingleQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
