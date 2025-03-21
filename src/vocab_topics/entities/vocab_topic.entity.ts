import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language } from '../../languages/entities/language.entity';

export enum VocabLevel {
  BEGINNER = 'beginner',
  MEDIUM = 'medium',
  ADVANCE = 'advance',
}

@Entity('vocab_topics')
export class VocabTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  topic: string;

  @Column({ name: 'language_id' })
  languageId: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({
    type: 'text',
    enum: VocabLevel,
    default: VocabLevel.BEGINNER,
  })
  level: VocabLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;
}
