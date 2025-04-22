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
import { ApiProperty } from '@nestjs/swagger';

export enum VocabDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

@Entity('vocabs')
export class Vocab {
  @ApiProperty({
    description: 'ID của từ vựng',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Từ vựng',
    example: 'cat',
  })
  @Column({ length: 100 })
  word: string;

  @ApiProperty({
    description: 'Định nghĩa của từ vựng',
    example:
      'Con mèo, một loại động vật có lông, thường được nuôi làm thú cưng',
  })
  @Column({ length: 255 })
  definition: string;

  @Column({ name: 'vocab_topic_id' })
  vocabTopicId: number;

  @ApiProperty({
    description: 'Ví dụ sử dụng từ vựng',
    example: 'I have a pet cat at home.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  example: string;

  @ApiProperty({
    description: 'Bản dịch của ví dụ',
    example: 'Tôi có một con mèo cưng ở nhà.',
    required: false,
  })
  @Column({ type: 'text', nullable: true, name: 'example_translation' })
  exampleTranslation: string;

  @ApiProperty({
    description: 'URL hình ảnh minh họa cho từ vựng',
    example: 'https://example.com/images/cat.jpg',
    nullable: true,
  })
  @Column({ nullable: true, name: 'image_url' })
  imageUrl: string;

  @ApiProperty({
    description: 'Thông tin chủ đề của từ vựng',
    type: () => VocabTopic,
  })
  @ManyToOne(() => VocabTopic)
  @JoinColumn({ name: 'vocab_topic_id' })
  topic: VocabTopic;

  @ApiProperty({
    description: 'Thời gian tạo từ vựng',
    example: '2023-08-01T12:00:00.000Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    example: '2023-08-01T12:00:00.000Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
