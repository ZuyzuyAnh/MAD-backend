import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VocabTopic } from '../../vocab_topics/entities/vocab_topic.entity';
import { Progress } from 'src/progress/entities/progress.entity';
import { VocabRepetition } from 'src/vocab_repetitions/entities/vocab_repetition.entity';

@Entity('vocab_topic_progress')
export class VocabTopicProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VocabTopic)
  topic: VocabTopic;

  @ManyToOne(() => Progress)
  progress: Progress;

  @Column({ name: 'topic_id' })
  topicId: number;

  @Column({ name: 'progress_id' })
  progressId: number;

  @OneToMany(
    () => VocabRepetition,
    (repetition) => repetition.vocabTopicProgress,
  )
  repetitions: VocabRepetition[];
}
