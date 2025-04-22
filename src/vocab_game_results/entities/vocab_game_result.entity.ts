import { Progress } from 'src/progress/entities/progress.entity';
import { VocabTopic } from 'src/vocab_topics/entities/vocab_topic.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vocab_game_results')
export class VocabGameResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'progress_id' })
  progressId: number;

  @Column({ name: 'vocab_topic_id' })
  vocabTopicId: number;

  @Column({ type: 'float', default: 0 })
  time: number;

  @ManyToOne(() => VocabTopic, (vocabTopic) => vocabTopic.id)
  @JoinColumn({ name: 'vocab_topic_id' })
  vocabTopic: VocabTopic;

  @ManyToOne(() => Progress, (progress) => progress.id)
  @JoinColumn({ name: 'progress_id' })
  progress: Progress;
}
