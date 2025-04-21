import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabRepetition } from './entities/vocab_repetition.entity';
import { Vocab, VocabDifficulty } from 'src/vocabs/entities/vocab.entity';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import EntityNotFoundException from 'src/exception/notfound.exception';
import { VocabTopicProgress } from 'src/vocab_topic_progress/entities/vocab_topic_progress.entity';
import { VocabTopicProgressService } from 'src/vocab_topic_progress/vocab_topic_progress.service';
import { ProgressService } from 'src/progress/progress.service';
import { VocabsService } from 'src/vocabs/vocabs.service';

@Injectable()
export class VocabRepetitionsService {
  constructor(
    @InjectRepository(VocabRepetition)
    private vocabRepetitionRepository: Repository<VocabRepetition>,
    @InjectRepository(VocabTopicProgress)
    private vocabTopicProgressRepository: Repository<VocabTopicProgress>,

    private vocabTopicProgressService: VocabTopicProgressService,
    private progressService: ProgressService,
    private vocabService: VocabsService,
  ) {}

  async getVocabsToReview(userId: number, topicId: number, limit: number = 20) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    const vocabTopicProgress =
      await this.vocabTopicProgressService.findOneByProgressAndTopic(
        progress.id,
        topicId,
      );

    if (!vocabTopicProgress) {
      throw new EntityNotFoundException('Tiến độ chủ đề', 'id', topicId);
    }

    const recentTimestamp = new Date();
    recentTimestamp.setMinutes(recentTimestamp.getMinutes() - 5);

    const repetitions = await this.vocabRepetitionRepository.find({
      where: [
        {
          vocabTopicProgress: { id: vocabTopicProgress.id },
          lastReviewedAt: IsNull(),
        },
        {
          vocabTopicProgress: { id: vocabTopicProgress.id },
          lastReviewedAt: LessThan(recentTimestamp),
        },
      ],
      relations: ['vocab'],
      order: {
        priorityScore: 'DESC',
      },
      take: limit,
    });

    return repetitions.map((repetition) => repetition.vocab);
  }

  async initializeRepetitionsForTopic(userId: number, topicId: number) {
    const progress =
      await this.progressService.findCurrentActiveProgress(userId);

    let vocabTopicProgress =
      await this.vocabTopicProgressService.findOneByProgressAndTopic(
        progress.id,
        topicId,
      );

    if (!vocabTopicProgress) {
      vocabTopicProgress = await this.vocabTopicProgressService.create({
        topicId: topicId,
        progressId: progress.id,
      });
    }

    const vocabs = await this.vocabService.findAllByTopic(topicId);

    const existingRepetitions = await this.vocabRepetitionRepository.find({
      where: {
        vocabTopicProgress: { id: vocabTopicProgress.id },
      },
    });

    const existingVocabIds = existingRepetitions.map(
      (repetition) => repetition.vocab.id,
    );

    const newRepetitions: VocabRepetition[] = [];

    for (const vocab of vocabs) {
      if (!existingVocabIds.includes(vocab.id)) {
        const randomFactor = Math.random();

        const repetition = this.vocabRepetitionRepository.create({
          vocab: vocab,
          vocabTopicProgress: vocabTopicProgress,
          easinessFactor: 2.5,
          repetitionCount: 0,
          priorityScore: 10 + randomFactor,
        });

        newRepetitions.push(repetition);
      }
    }

    if (newRepetitions.length > 0) {
      await this.vocabRepetitionRepository.save(newRepetitions);
    }
  }

  async updateRepetition(
    userId: number,
    topicId: number,
    vocabId: number,
    difficulty: VocabDifficulty,
  ) {
    const vocabTopicProgress = await this.vocabTopicProgressRepository.findOne({
      where: {
        progress: { user: { id: userId } },
        topic: { id: topicId },
      },
    });

    if (!vocabTopicProgress) {
      throw new EntityNotFoundException('Tiến độ chủ đề', 'id', topicId);
    }

    const repetition = await this.vocabRepetitionRepository.findOne({
      where: {
        vocabTopicProgress: { id: vocabTopicProgress.id },
        vocab: { id: vocabId },
      },
    });

    if (!repetition) {
      throw new EntityNotFoundException('Từ vựng', 'id', vocabId);
    }

    const grade = this.mapDifficultyToGrade(difficulty);
    const now = new Date();

    // Cập nhật easiness_factor
    repetition.easinessFactor +=
      0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
    if (repetition.easinessFactor < 1.3) repetition.easinessFactor = 1.3;

    // Tăng repetition_count
    repetition.repetitionCount += 1;

    // Cập nhật last_reviewed_at
    repetition.lastReviewedAt = now;
    repetition.lastDifficulty = difficulty;

    // Tính lại priority_score
    const randomFactor = Math.random();
    repetition.priorityScore =
      10 -
      repetition.easinessFactor * 2 +
      (5 - Math.min(repetition.repetitionCount, 5)) +
      randomFactor;

    await this.vocabRepetitionRepository.save(repetition);
  }

  async getRepetitionStats(userId: number, topicId: number) {
    const vocabTopicProgress = await this.vocabTopicProgressRepository.findOne({
      where: {
        progress: { user: { id: userId } },
        topic: { id: topicId },
      },
    });

    if (!vocabTopicProgress) {
      throw new EntityNotFoundException('Tiến độ chủ đề', 'id', topicId);
    }

    const repetitions = await this.vocabRepetitionRepository.find({
      where: { vocabTopicProgress: { id: vocabTopicProgress.id } },
    });

    const totalVocabs = repetitions.length;
    const mastered = repetitions.filter((r) => r.repetitionCount >= 3).length;
    const learningCount = repetitions.filter(
      (r) => r.repetitionCount > 0 && r.repetitionCount < 3,
    ).length;
    const notStarted = repetitions.filter(
      (r) => r.repetitionCount === 0,
    ).length;

    // Thời gian "grace period" - 5 phút
    const recentTimestamp = new Date();
    recentTimestamp.setMinutes(recentTimestamp.getMinutes() - 5);

    // Từ vựng có thể ôn tập (không nằm trong grace period)
    const readyToReview = repetitions.filter(
      (r) => !r.lastReviewedAt || r.lastReviewedAt < recentTimestamp,
    ).length;

    return {
      totalVocabs,
      mastered,
      learning: learningCount,
      notStarted,
      readyToReview,
    };
  }

  async getVocabsByStatus(
    userId: number,
    topicId: number,
    status: 'mastered' | 'learning' | 'not_started' | 'all',
  ) {
    const vocabTopicProgress = await this.vocabTopicProgressRepository.findOne({
      where: {
        progress: { user: { id: userId } },
        topic: { id: topicId },
      },
    });

    if (!vocabTopicProgress) {
      throw new EntityNotFoundException('Tiến độ chủ đề', 'id', topicId);
    }

    const queryBuilder = this.vocabRepetitionRepository
      .createQueryBuilder('repetition')
      .leftJoinAndSelect('repetition.vocab', 'vocab')
      .where('repetition.vocabTopicProgressId = :progressId', {
        progressId: vocabTopicProgress.id,
      });

    // Áp dụng bộ lọc theo trạng thái
    if (status === 'mastered') {
      queryBuilder.andWhere('repetition.repetitionCount >= 3');
    } else if (status === 'learning') {
      queryBuilder.andWhere(
        'repetition.repetitionCount > 0 AND repetition.repetitionCount < 3',
      );
    } else if (status === 'not_started') {
      queryBuilder.andWhere('repetition.repetitionCount = 0');
    }

    const repetitions = await queryBuilder.getMany();
    return repetitions.map((repetition) => repetition.vocab);
  }

  private mapDifficultyToGrade(difficulty: VocabDifficulty): number {
    switch (difficulty) {
      case VocabDifficulty.EASY:
        return 1;
      case VocabDifficulty.MEDIUM:
        return 3;
      case VocabDifficulty.HARD:
        return 5;
      default:
        return 3;
    }
  }
}
