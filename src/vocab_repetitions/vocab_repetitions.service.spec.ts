import { Test, TestingModule } from '@nestjs/testing';
import { VocabRepetitionsService } from './vocab_repetitions.service';

describe('VocabRepetitionsService', () => {
  let service: VocabRepetitionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VocabRepetitionsService],
    }).compile();

    service = module.get<VocabRepetitionsService>(VocabRepetitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
