import { VocabGame } from 'src/vocab_games/entities/vocab_game.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ScrambleAndListenChallange,
  WordMatchChallange,
} from './challanges.entity';

export enum VocabGameChallangeType {
  LINK = 'link',
  SCRAMBLE = 'scramble',
  LISTEN = 'listen',
}

@Entity()
export class VocabGameChallange {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => VocabGame, (vocabGame) => vocabGame.vocabGameChallanges)
  vocabGame: VocabGame;

  @Column({
    type: 'jsonb',
  })
  data: WordMatchChallange | ScrambleAndListenChallange;

  @Column({
    type: 'enum',
    enum: VocabGameChallangeType,
  })
  type: VocabGameChallangeType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
