import { Test, TestingModule } from '@nestjs/testing';
import { MediaResroucesService } from './media_resrouces.service';

describe('MediaResroucesService', () => {
  let service: MediaResroucesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaResroucesService],
    }).compile();

    service = module.get<MediaResroucesService>(MediaResroucesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
