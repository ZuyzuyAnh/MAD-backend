import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VocabTopicProgress } from 'src/vocab_topics/entities/vocab_topic_progress.entity';
import { Vocab, VocabDifficulty } from 'src/vocabs/entities/vocab.entity';

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
  })
  easinessFactor: number;

  @Column({
    default: 0,
  })
  interval: number;

  @Column({ default: 0 })
  repetitionCount: number;

  @Column({ nullable: true })
  lastReviewDate: Date;

  @Column({ nullable: true })
  nextReviewDate: Date;

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
