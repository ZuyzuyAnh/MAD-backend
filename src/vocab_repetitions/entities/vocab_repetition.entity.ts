import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vocab, VocabDifficulty } from 'src/vocabs/entities/vocab.entity';
import { VocabTopicProgress } from 'src/vocab_topic_progress/entities/vocab_topic_progress.entity';

@Entity('vocab_repetition')
export class VocabRepetition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vocab)
  @JoinColumn({ name: 'vocab_id' })
  vocab: Vocab;

  @ManyToOne(() => VocabTopicProgress)
  @JoinColumn({ name: 'vocab_topic_progress_id' })
  vocabTopicProgress: VocabTopicProgress;

  @Column({
    default: 2.5,
    type: 'float',
  })
  easinessFactor: number;

  @Column({ default: 0 })
  repetitionCount: number;

  @Column({
    default: 10,
    type: 'float',
  })
  priorityScore: number;

  @Column({ nullable: true })
  lastReviewedAt: Date;

  @Column({
    type: 'enum',
    enum: VocabDifficulty,
    nullable: true,
  })
  lastDifficulty: VocabDifficulty;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
