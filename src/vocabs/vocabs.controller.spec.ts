import { Test, TestingModule } from '@nestjs/testing';
import { VocabsController } from './vocabs.controller';
import { VocabsService } from './vocabs.service';

describe('VocabsController', () => {
  let controller: VocabsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VocabsController],
      providers: [VocabsService],
    }).compile();

    controller = module.get<VocabsController>(VocabsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
