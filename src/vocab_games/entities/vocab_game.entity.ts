import { ApiProperty } from '@nestjs/swagger';
import { VocabGameChallange } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';
import { VocabGameResult } from 'src/vocab_game_results/entities/vocab_game_result.entity';
import { VocabTopic } from 'src/vocab_topics/entities/vocab_topic.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VocabGame {
  @ApiProperty({
    description: 'ID của trò chơi từ vựng',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tiêu đề của trò chơi từ vựng',
    example: 'Trò chơi động vật',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Chủ đề từ vựng liên kết với trò chơi',
    type: () => VocabTopic,
  })
  @ManyToOne(() => VocabTopic)
  @JoinColumn({ name: 'vocab_topic_id' })
  vocabTopic: VocabTopic;

  @ApiProperty({
    description: 'Danh sách các thử thách trong trò chơi',
    type: () => [VocabGameChallange],
  })
  @OneToMany(
    () => VocabGameChallange,
    (vocabGameChallange) => vocabGameChallange.vocabGame,
  )
  vocabGameChallanges: VocabGameChallange[];

  @OneToMany(
    () => VocabGameResult,
    (vocabGameResult) => vocabGameResult.vocabGame,
  )
  vocabGameResults: VocabGameResult[];

  @ApiProperty({
    description: 'Thời gian tạo trò chơi',
    example: '2023-08-15T12:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật trò chơi gần nhất',
    example: '2023-08-15T14:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
