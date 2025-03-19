import { Test, TestingModule } from '@nestjs/testing';
import { MediaResroucesController } from './media_resrouces.controller';
import { MediaResroucesService } from './media_resrouces.service';

describe('MediaResroucesController', () => {
  let controller: MediaResroucesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaResroucesController],
      providers: [MediaResroucesService],
    }).compile();

    controller = module.get<MediaResroucesController>(MediaResroucesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
