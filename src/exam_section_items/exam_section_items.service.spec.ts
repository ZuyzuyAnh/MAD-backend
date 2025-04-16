import { Test, TestingModule } from '@nestjs/testing';
import { ExamSectionItemsService } from './exam_section_items.service';

describe('ExamSectionItemsService', () => {
  let service: ExamSectionItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamSectionItemsService],
    }).compile();

    service = module.get<ExamSectionItemsService>(ExamSectionItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
