import { Progress } from 'src/progress/entities/progress.entity';
import { VocabGame } from 'src/vocab_games/entities/vocab_game.entity';
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

  @Column({ name: 'vocab_game_id' })
  vocabGameId: number;

  @Column({ type: 'float', default: 0 })
  time: number;

  @ManyToOne(() => VocabGame, (vocabGame) => vocabGame.id)
  @JoinColumn({ name: 'vocab_game_id' })
  vocabGame: VocabGame;

  @ManyToOne(() => Progress, (progress) => progress.id)
  @JoinColumn({ name: 'progress_id' })
  progress: Progress;
}
