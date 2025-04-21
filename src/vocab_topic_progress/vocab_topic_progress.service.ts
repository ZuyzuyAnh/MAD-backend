import { Injectable } from '@nestjs/common';
import { CreateVocabTopicProgressDto } from './dto/create-vocab_topic_progress.dto';
import { UpdateVocabTopicProgressDto } from './dto/update-vocab_topic_progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabTopicProgress } from './entities/vocab_topic_progress.entity';
import { Repository } from 'typeorm';
import { ProgressService } from 'src/progress/progress.service';

@Injectable()
export class VocabTopicProgressService {
  constructor(
    @InjectRepository(VocabTopicProgress)
    private readonly vocabTopicProgressRepository: Repository<VocabTopicProgress>,
  ) {}

  create(createVocabTopicProgressDto: CreateVocabTopicProgressDto) {
    const vocabTopicProgress = this.vocabTopicProgressRepository.create({
      topic: {
        id: createVocabTopicProgressDto.topicId,
      },
      progress: {
        id: createVocabTopicProgressDto.progressId,
      },
    });

    return this.vocabTopicProgressRepository.save(vocabTopicProgress);
  }

  async findOneByProgressAndTopic(progressId: number, topicId: number) {
    return this.vocabTopicProgressRepository.findOne({
      where: {
        progress: { id: progressId },
        topic: { id: topicId },
      },
    });
  }

  findAll() {
    return `This action returns all vocabTopicProgress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vocabTopicProgress`;
  }

  update(id: number, updateVocabTopicProgressDto: UpdateVocabTopicProgressDto) {
    return `This action updates a #${id} vocabTopicProgress`;
  }

  remove(id: number) {
    return `This action removes a #${id} vocabTopicProgress`;
  }

  async findUserLearnedTopics(userId: number) {
    const queryBuilder = this.vocabTopicProgressRepository
      .createQueryBuilder('vocabTopicProgress')
      .innerJoin('vocabTopicProgress.topic', 'vocabTopic')
      .innerJoin('vocabTopicProgress.progress', 'progress')
      .innerJoin('progress.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('progress.is_current_active = true');

    return queryBuilder.getCount();
  }

  async countByProgress(progressId: number) {
    return this.vocabTopicProgressRepository.countBy({
      progress: { id: progressId },
    });
  }
}
