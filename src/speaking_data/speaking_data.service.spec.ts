import { Test, TestingModule } from '@nestjs/testing';
import { SpeakingDataService } from './speaking_data.service';

describe('SpeakingDataService', () => {
  let service: SpeakingDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakingDataService],
    }).compile();

    service = module.get<SpeakingDataService>(SpeakingDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
