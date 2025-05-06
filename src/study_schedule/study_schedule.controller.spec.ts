import { Test, TestingModule } from '@nestjs/testing';
import { StudyScheduleController } from './study_schedule.controller';
import { StudyScheduleService } from './study_schedule.service';

describe('StudyScheduleController', () => {
  let controller: StudyScheduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyScheduleController],
      providers: [StudyScheduleService],
    }).compile();

    controller = module.get<StudyScheduleController>(StudyScheduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
