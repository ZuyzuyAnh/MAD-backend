import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID của thử thách từ vựng',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Trò chơi từ vựng mà thử thách thuộc về',
    type: () => VocabGame,
  })
  @ManyToOne(() => VocabGame, (vocabGame) => vocabGame.vocabGameChallanges)
  vocabGame: VocabGame;

  @ApiProperty({
    description:
      'Dữ liệu của thử thách, định dạng phụ thuộc vào loại thử thách',
    example: {
      words: [
        { word: 'cat', translation: 'mèo' },
        { word: 'dog', translation: 'chó' },
      ],
    },
  })
  @Column({
    type: 'jsonb',
  })
  data: WordMatchChallange | ScrambleAndListenChallange;

  @ApiProperty({
    description: 'Loại thử thách',
    enum: VocabGameChallangeType,
    example: VocabGameChallangeType.LINK,
  })
  @Column({
    type: 'enum',
    enum: VocabGameChallangeType,
  })
  type: VocabGameChallangeType;

  @ApiProperty({
    description: 'Thời gian tạo thử thách',
    example: '2023-08-15T12:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật thử thách gần nhất',
    example: '2023-08-15T14:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
