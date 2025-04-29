import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpeakingDatumDto } from './dto/create-speaking_datum.dto';
import { UpdateSpeakingDatumDto } from './dto/update-speaking_datum.dto';
import { SpeakingDatum } from './entities/speaking_datum.entity';

@Injectable()
export class SpeakingDataService {
  constructor(
    @InjectRepository(SpeakingDatum)
    private readonly speakingDatumRepository: Repository<SpeakingDatum>,
  ) {}

  async create(
    createSpeakingDatumDto: CreateSpeakingDatumDto,
  ): Promise<SpeakingDatum> {
    const speakingDatum = this.speakingDatumRepository.create(
      createSpeakingDatumDto,
    );
    return this.speakingDatumRepository.save(speakingDatum);
  }

  async findAll(): Promise<SpeakingDatum[]> {
    return this.speakingDatumRepository.find({
      relations: ['exercise'],
    });
  }

  async findOne(id: number): Promise<SpeakingDatum> {
    const speakingDatum = await this.speakingDatumRepository.findOne({
      where: { id },
      relations: ['exercise'],
    });

    if (!speakingDatum) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu luyện nói với id: ${id}`,
      );
    }

    return speakingDatum;
  }

  async findByExerciseId(exerciseId: number): Promise<SpeakingDatum[]> {
    return this.speakingDatumRepository.find({
      where: { exerciseId },
      order: { id: 'ASC' },
    });
  }

  async update(
    id: number,
    updateSpeakingDatumDto: UpdateSpeakingDatumDto,
  ): Promise<SpeakingDatum> {
    const speakingDatum = await this.findOne(id);

    Object.assign(speakingDatum, updateSpeakingDatumDto);

    return this.speakingDatumRepository.save(speakingDatum);
  }

  async remove(id: number): Promise<void> {
    const result = await this.speakingDatumRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu luyện nói với id: ${id}`,
      );
    }
  }
}
