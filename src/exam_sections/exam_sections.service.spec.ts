import { Test, TestingModule } from '@nestjs/testing';
import { ExamSectionsService } from './exam_sections.service';

describe('ExamSectionsService', () => {
  let service: ExamSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamSectionsService],
    }).compile();

    service = module.get<ExamSectionsService>(ExamSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
