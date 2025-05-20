import { Test, TestingModule } from '@nestjs/testing';
import { PostReportsService } from './post_reports.service';

describe('PostReportsService', () => {
  let service: PostReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostReportsService],
    }).compile();

    service = module.get<PostReportsService>(PostReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
