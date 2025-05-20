import { Test, TestingModule } from '@nestjs/testing';
import { ExamSectionsController } from './exam_sections.controller';
import { ExamSectionsService } from './exam_sections.service';

describe('ExamSectionsController', () => {
  let controller: ExamSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSectionsController],
      providers: [ExamSectionsService],
    }).compile();

    controller = module.get<ExamSectionsController>(ExamSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
