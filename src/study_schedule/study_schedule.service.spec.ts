import { Test, TestingModule } from '@nestjs/testing';
import { StudyScheduleService } from './study_schedule.service';

describe('StudyScheduleService', () => {
  let service: StudyScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyScheduleService],
    }).compile();

    service = module.get<StudyScheduleService>(StudyScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
