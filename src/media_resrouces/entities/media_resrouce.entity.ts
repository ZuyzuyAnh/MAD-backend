import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MediaResourceType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

@Entity('media_resources')
export class MediaResource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  url: string;

  @Column({
    type: 'enum',
    enum: MediaResourceType,
    enumName: 'media_resources_type',
  })
  type: MediaResourceType;

  @Column({ length: 255, nullable: true })
  filename: string;

  @Column({ nullable: true })
  file_size: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
