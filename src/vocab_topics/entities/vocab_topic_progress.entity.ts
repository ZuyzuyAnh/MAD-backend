import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { VocabTopic } from './vocab_topic.entity';
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

  @OneToMany(
    () => VocabRepetition,
    (repetition) => repetition.vocabTopicProgress,
  )
  repetitions: VocabRepetition[];
}
