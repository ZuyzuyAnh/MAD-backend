import { Test, TestingModule } from '@nestjs/testing';
import { VocabGameResultsController } from './vocab_game_results.controller';
import { VocabGameResultsService } from './vocab_game_results.service';

describe('VocabGameResultsController', () => {
  let controller: VocabGameResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabGameResultsController],
      providers: [VocabGameResultsService],
    }).compile();

    controller = module.get<VocabGameResultsController>(VocabGameResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
