import { Injectable } from '@nestjs/common';
import { CreateVocabTopicProgressDto } from './dto/create-vocab_topic_progress.dto';
import { UpdateVocabTopicProgressDto } from './dto/update-vocab_topic_progress.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabTopicProgress } from './entities/vocab_topic_progress.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VocabTopicProgressService {
  constructor(
    @InjectRepository(VocabTopicProgress)
    private readonly vocabTopicProgressRepository: Repository<VocabTopicProgress>,
  ) {}

  create(createVocabTopicProgressDto: CreateVocabTopicProgressDto) {
    return 'This action adds a new vocabTopicProgress';
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
