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
import { Language } from '../../languages/entities/language.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Vocab } from 'src/vocabs/entities/vocab.entity';

export enum VocabLevel {
  BEGINNER = 'beginner',
  MEDIUM = 'medium',
  ADVANCE = 'advance',
}

@Entity('vocab_topics')
export class VocabTopic {
  @ApiProperty({
    description: 'ID của chủ đề từ vựng',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tên chủ đề từ vựng',
    example: 'Động vật',
  })
  @Column({ length: 100 })
  topic: string;

  @ApiProperty({
    description: 'URL hình ảnh đại diện cho chủ đề',
    example: 'https://example.com/images/animals.jpg',
  })
  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ApiProperty({
    description: 'Cấp độ của chủ đề từ vựng',
    enum: VocabLevel,
    example: VocabLevel.BEGINNER,
  })
  @Column({
    type: 'text',
    enum: VocabLevel,
    default: VocabLevel.BEGINNER,
  })
  level: VocabLevel;

  @ApiProperty({
    description: 'Thời gian tạo chủ đề',
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

  @ApiProperty({
    description: 'Thông tin ngôn ngữ của chủ đề từ vựng',
    type: () => Language,
  })
  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @OneToMany(() => Vocab, (vocab) => vocab.topic)
  vocabs: Vocab[];
}
