import { Test, TestingModule } from '@nestjs/testing';
import { SpeakingDataController } from './speaking_data.controller';
import { SpeakingDataService } from './speaking_data.service';

describe('SpeakingDataController', () => {
  let controller: SpeakingDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakingDataController],
      providers: [SpeakingDataService],
    }).compile();

    controller = module.get<SpeakingDataController>(SpeakingDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
