import { Test, TestingModule } from '@nestjs/testing';
import { VocabTopicProgressController } from './vocab_topic_progress.controller';
import { VocabTopicProgressService } from './vocab_topic_progress.service';

describe('VocabTopicProgressController', () => {
  let controller: VocabTopicProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabTopicProgressController],
      providers: [VocabTopicProgressService],
    }).compile();

    controller = module.get<VocabTopicProgressController>(
      VocabTopicProgressController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
