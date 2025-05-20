import { Test, TestingModule } from '@nestjs/testing';
import { VocabTopicsService } from './vocab_topics.service';

describe('VocabTopicsService', () => {
  let service: VocabTopicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabTopicsService],
    }).compile();

    service = module.get<VocabTopicsService>(VocabTopicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
