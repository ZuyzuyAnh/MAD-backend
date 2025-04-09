import { Test, TestingModule } from '@nestjs/testing';
import { VocabGameChallangesService } from './vocab_game_challanges.service';

describe('VocabGameChallangesService', () => {
  let service: VocabGameChallangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabGameChallangesService],
    }).compile();

    service = module.get<VocabGameChallangesService>(VocabGameChallangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
