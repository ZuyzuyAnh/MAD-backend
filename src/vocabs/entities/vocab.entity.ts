import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VocabTopic } from '../../vocab_topics/entities/vocab_topic.entity';

export enum VocabDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Entity('vocabs')
export class Vocab {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  word: string;

  @Column({ length: 255 })
  definition: string;

  @Column({ type: 'text', nullable: true })
  example: string;

  @Column({ type: 'text', nullable: true, name: 'example_translation' })
  exampleTranslation: string;

  @Column({ type: 'enum', enum: VocabDifficulty })
  difficulty: VocabDifficulty;

  @Column({ name: 'topic_id' })
  topicId: number;

  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => VocabTopic)
  @JoinColumn({ name: 'topic_id' })
  topic: VocabTopic;
}
