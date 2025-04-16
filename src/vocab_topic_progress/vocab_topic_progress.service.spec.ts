import { Test, TestingModule } from '@nestjs/testing';
import { VocabTopicProgressService } from './vocab_topic_progress.service';

describe('VocabTopicProgressService', () => {
  let service: VocabTopicProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabTopicProgressService],
    }).compile();

    service = module.get<VocabTopicProgressService>(VocabTopicProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
