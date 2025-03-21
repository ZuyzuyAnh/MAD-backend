import { Test, TestingModule } from '@nestjs/testing';
import { VocabTopicsController } from './vocab_topics.controller';
import { VocabTopicsService } from './vocab_topics.service';

describe('VocabTopicsController', () => {
  let controller: VocabTopicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabTopicsController],
      providers: [VocabTopicsService],
    }).compile();

    controller = module.get<VocabTopicsController>(VocabTopicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
