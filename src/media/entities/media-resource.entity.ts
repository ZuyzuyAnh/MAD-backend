import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
export enum MediaType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  DOCUMENT = 'document',
}

@Entity('media_resources')
export class MediaResource {
  @ApiProperty({ description: 'ID của tài nguyên media', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Tên tài nguyên',
    example: 'pronunciation_example.mp3',
  })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({
    description: 'URL của tài nguyên',
    example: 'https://storage.example.com/media/pronunciation_example.mp3',
  })
  @Column()
  url: string;

  @ApiProperty({
    description: 'Loại tài nguyên media',
    enum: MediaType,
    example: MediaType.AUDIO,
  })
  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @ApiProperty({
    description: 'Thông tin bổ sung về tài nguyên',
    example: { duration: '00:05:23', size: '4.2MB' },
  })
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
