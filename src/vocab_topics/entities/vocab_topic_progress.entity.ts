import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { VocabTopic } from './vocab_topic.entity';
import { Progress } from 'src/progress/entities/progress.entity';

@Entity('vocab_topic_progress')
export class VocabTopicProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VocabTopic)
  topic: VocabTopic;

  @ManyToOne(() => Progress)
  progress: Progress;
}
