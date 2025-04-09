import { Test, TestingModule } from '@nestjs/testing';
import { VocabGamesService } from './vocab_games.service';

describe('VocabGamesService', () => {
  let service: VocabGamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabGamesService],
    }).compile();

    service = module.get<VocabGamesService>(VocabGamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
