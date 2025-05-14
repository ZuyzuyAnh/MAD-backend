import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ReportReason {
  SPAM = 'spam',
  ABUSE = 'abuse',
  HARASSMENT = 'harassment',
  INAPPROPRIATE = 'inappropriate',
  COPYRIGHT = 'copyright',
  OTHER = 'other',
}

@Entity('post_reports')
export class PostReport {
  @ApiProperty({
    description: 'ID của báo cáo',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID của bài viết bị báo cáo',
    example: 5,
  })
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty({
    description: 'ID của người báo cáo',
    example: 42,
  })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({
    description: 'Lý do báo cáo',
    enum: ReportReason,
    example: ReportReason.INAPPROPRIATE,
  })
  @Column({
    name: 'reason',
    type: 'enum',
    enum: ReportReason,
  })
  reason: ReportReason;

  @ApiProperty({
    description: 'Mô tả chi tiết về báo cáo',
    example: 'Bài viết này có nội dung không phù hợp...',
  })
  @Column({ name: 'description', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Trạng thái xử lý báo cáo',
    example: false,
  })
  @Column({ name: 'is_resolved', default: false })
  isResolved: boolean;

  @ApiProperty({
    description: 'Thông tin bài viết bị báo cáo',
    type: () => Post,
  })
  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ApiProperty({
    description: 'Thông tin người báo cáo',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
