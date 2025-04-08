import { Injectable } from '@nestjs/common';
import { CreateVocabRepetitionDto } from './dto/create-vocab_repetition.dto';
import { UpdateVocabRepetitionDto } from './dto/update-vocab_repetition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VocabRepetition } from './entities/vocab_repetition.entity';
import { Vocab, VocabDifficulty } from 'src/vocabs/entities/vocab.entity';
import { VocabTopicProgress } from 'src/vocab_topics/entities/vocab_topic_progress.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import EntityNotFoundException from 'src/exception/notfound.exception';

@Injectable()
export class VocabRepetitionsService {
  constructor(
    @InjectRepository(VocabRepetition)
    private vocabRepetitionRepository: Repository<VocabRepetition>,
    @InjectRepository(Vocab)
    private vocabRepository: Repository<Vocab>,
    @InjectRepository(VocabTopicProgress)
    private vocabTopicProgressRepository: Repository<VocabTopicProgress>,
  ) {}

  async getVocabsToReview(userId: number, topicId: number) {
    const today = new Date();

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
      where: {
        vocabTopicProgress: { id: vocabTopicProgress.id },
        nextReviewDate: LessThanOrEqual(today),
      },
      relations: ['vocab'],
      order: {
        easinessFactor: 'ASC',
      },
    });

    return repetitions.map((repetition) => repetition.vocab);
  }

  async initializeRepetitionsForTopic(userId: number, topicId: number) {
    let vocabTopicProgress = await this.vocabTopicProgressRepository.findOne({
      where: {
        progress: { user: { id: userId } },
        topic: { id: topicId },
      },
    });

    if (!vocabTopicProgress) {
      vocabTopicProgress = this.vocabTopicProgressRepository.create({
        progress: { user: { id: userId } },
        topic: { id: topicId },
      });

      await this.vocabRepetitionRepository.save(vocabTopicProgress);
    }

    const vocabs = await this.vocabRepository.find({
      where: { topic: { id: topicId } },
    });

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
        const repetition = this.vocabRepetitionRepository.create({
          vocab: vocab,
          vocabTopicProgress: vocabTopicProgress,
          easinessFactor: 2.5,
          interval: 0,
          repetitionCount: 0,
          nextReviewDate: new Date(),
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
    vocabId: number,
    topicId: number,
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
    const today = new Date();

    if (grade >= 3) {
      if (repetition.repetitionCount === 0) {
        repetition.interval = 1;
      } else if (repetition.repetitionCount === 1) {
        repetition.interval = 6;
      } else {
        repetition.interval = Math.round(
          repetition.interval * repetition.easinessFactor,
        );
      }

      repetition.repetitionCount += 1;
    } else {
      repetition.repetitionCount = 0;
      repetition.interval = 1;
    }

    repetition.easinessFactor +=
      0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
    if (repetition.easinessFactor < 1.3) repetition.easinessFactor = 1.3;

    repetition.lastReviewDate = today;
    const nextDate = new Date();

    nextDate.setDate(today.getDate() + repetition.interval);
    repetition.nextReviewDate = nextDate;
    repetition.lastDifficulty = difficulty;

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

    const dueToday = repetitions.filter((r) => {
      const today = new Date();
      return r.nextReviewDate && r.nextReviewDate <= today;
    }).length;

    return {
      totalVocabs,
      mastered,
      learning: learningCount,
      notStarted,
      dueToday,
    };
  }

  private mapDifficultyToGrade(difficulty: VocabDifficulty): number {
    switch (difficulty) {
      case VocabDifficulty.BEGINNER:
        return 1;
      case VocabDifficulty.INTERMEDIATE:
        return 3;
      case VocabDifficulty.ADVANCED:
        return 5;
      default:
        return 3;
    }
  }
}
