import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import NotFoundException from '../exception/notfound.exception';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(userId: number, createProgressDto: CreateProgressDto) {
    const progress = this.progressRepository.create({
      ...createProgressDto,
      user: { id: userId },
      language: { id: createProgressDto.languageId },
    });

    return await this.progressRepository.save(progress);
  }

  async findOne(id: number) {
    const progress = await this.progressRepository.findOne({
      where: { id },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async findOneByUserId(userId: number) {
    const progress = await this.progressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async findByUserAndLanguage(userId: number, languageId: number) {
    const progress = await this.progressRepository.findOne({
      where: {
        user: { id: userId },
        language: { id: languageId },
      },
      relations: ['user', 'language'],
    });

    return progress;
  }

  async update(id: number, updateProgressDto: UpdateProgressDto) {
    const progress = await this.findOne(id);

    if (!progress) {
      throw new NotFoundException('progress', 'id', id);
    }

    Object.assign(progress, updateProgressDto);

    return this.progressRepository.save(progress);
  }

  async findCurrentActiveProgress(userId: number) {
    const progress = await this.progressRepository.findOne({
      where: { user: { id: userId }, isCurrentActive: true },
      relations: ['user', 'language'],
    });

    if (!progress) {
      throw new NotFoundException('progress', 'userId', userId);
    }

    return progress;
  }

  async createOrUpdateProgress(userId: number, languageId: number) {
    let progress = await this.progressRepository.findOne({
      where: {
        user: { id: userId },
        language: { id: languageId },
      },
      relations: ['user', 'language'],
    });

    if (progress) {
      progress.isCurrentActive = true;

      await this.progressRepository
        .createQueryBuilder()
        .update(Progress)
        .set({ isCurrentActive: false })
        .where('userId = :userId AND id != :progressId', {
          userId: userId,
          progressId: progress.id,
        })
        .execute();
    } else {
      progress = this.progressRepository.create({
        user: { id: userId },
        language: { id: languageId },
        isCurrentActive: true,
      });
    }

    return this.progressRepository.save(progress);
  }
}
