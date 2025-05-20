import { Test, TestingModule } from '@nestjs/testing';
import { PostReportsController } from './post_reports.controller';

describe('PostReportsController', () => {
  let controller: PostReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostReportsController],
    }).compile();

    controller = module.get<PostReportsController>(PostReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
