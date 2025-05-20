import { Test, TestingModule } from '@nestjs/testing';
import { VocabGameResultsService } from './vocab_game_results.service';

describe('VocabGameResultsService', () => {
  let service: VocabGameResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabGameResultsService],
    }).compile();

    service = module.get<VocabGameResultsService>(VocabGameResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
