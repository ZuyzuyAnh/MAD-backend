import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyScheduleDto } from './dto/create-study_schedule.dto';
import { UpdateStudyScheduleDto } from './dto/update-study_schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudySchedule } from './entities/study_schedule.entity';
import { Repository } from 'typeorm';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class StudyScheduleService {
  constructor(
    @InjectRepository(StudySchedule)
    private readonly studyScheduleRepository: Repository<StudySchedule>,
    private readonly progressService: ProgressService,
  ) {}

  async create(
    userId: number,
    createStudyScheduleDto: CreateStudyScheduleDto,
  ): Promise<StudySchedule> {
    const porgress =
      await this.progressService.findCurrentActiveProgress(userId);

    const studySchedule = this.studyScheduleRepository.create({
      ...createStudyScheduleDto,
      progress: porgress,
    });
    return await this.studyScheduleRepository.save(studySchedule);
  }

  async findAll(): Promise<StudySchedule[]> {
    return await this.studyScheduleRepository.find();
  }

  async findOne(id: number): Promise<StudySchedule> {
    const studySchedule = await this.studyScheduleRepository.findOne({
      where: { id },
    });

    if (!studySchedule) {
      throw new NotFoundException(`Study schedule with ID ${id} not found`);
    }

    return studySchedule;
  }

  async update(
    id: number,
    updateStudyScheduleDto: UpdateStudyScheduleDto,
  ): Promise<StudySchedule> {
    const studySchedule = await this.findOne(id);

    // Apply updates from the DTO
    Object.assign(studySchedule, updateStudyScheduleDto);

    return await this.studyScheduleRepository.save(studySchedule);
  }

  async remove(id: number): Promise<void> {
    const result = await this.studyScheduleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Study schedule with ID ${id} not found`);
    }
  }

  async findByUser(userId: number): Promise<StudySchedule[]> {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);
    console.log('progress', progress);
    const studySchedules = await this.studyScheduleRepository.find({
      where: { progressId: progress.id },
      order: { weekday: 'ASC' },
    });

    console.log('studySchedules', studySchedules);

    return studySchedules;
  }
}
