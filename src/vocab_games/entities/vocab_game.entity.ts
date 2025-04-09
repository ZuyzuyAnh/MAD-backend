import { VocabGameChallange } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';
import { VocabTopic } from 'src/vocab_topics/entities/vocab_topic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VocabGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => VocabTopic)
  vocabTopic: VocabTopic;

  @OneToMany(
    () => VocabGameChallange,
    (vocabGameChallange) => vocabGameChallange.vocabGame,
  )
  vocabGameChallanges: VocabGameChallange[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
