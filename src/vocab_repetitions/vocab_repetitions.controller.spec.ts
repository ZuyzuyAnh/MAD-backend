import { Test, TestingModule } from '@nestjs/testing';
import { VocabRepetitionsController } from './vocab_repetitions.controller';
import { VocabRepetitionsService } from './vocab_repetitions.service';

describe('VocabRepetitionsController', () => {
  let controller: VocabRepetitionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabRepetitionsController],
      providers: [VocabRepetitionsService],
    }).compile();

    controller = module.get<VocabRepetitionsController>(
      VocabRepetitionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
