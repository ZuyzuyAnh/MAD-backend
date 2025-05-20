import { Test, TestingModule } from '@nestjs/testing';
import { ExamSectionItemsController } from './exam_section_items.controller';
import { ExamSectionItemsService } from './exam_section_items.service';

describe('ExamSectionItemsController', () => {
  let controller: ExamSectionItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSectionItemsController],
      providers: [ExamSectionItemsService],
    }).compile();

    controller = module.get<ExamSectionItemsController>(
      ExamSectionItemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
