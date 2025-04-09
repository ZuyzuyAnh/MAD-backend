import { Test, TestingModule } from '@nestjs/testing';
import { VocabGameChallangesController } from './vocab_game_challanges.controller';
import { VocabGameChallangesService } from './vocab_game_challanges.service';

describe('VocabGameChallangesController', () => {
  let controller: VocabGameChallangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabGameChallangesController],
      providers: [VocabGameChallangesService],
    }).compile();

    controller = module.get<VocabGameChallangesController>(VocabGameChallangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
