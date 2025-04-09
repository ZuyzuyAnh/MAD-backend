import { Test, TestingModule } from '@nestjs/testing';
import { VocabGamesController } from './vocab_games.controller';
import { VocabGamesService } from './vocab_games.service';

describe('VocabGamesController', () => {
  let controller: VocabGamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabGamesController],
      providers: [VocabGamesService],
    }).compile();

    controller = module.get<VocabGamesController>(VocabGamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
