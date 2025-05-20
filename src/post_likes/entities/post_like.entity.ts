import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post_likes')
export class PostLike {
  @ApiProperty({
    description: 'ID của lượt thích bài viết',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'ID của bài viết được thích',
    example: 5,
  })
  @Column({ name: 'post_id' })
  postId: number;

  @ApiProperty({
    description: 'ID của người dùng đã thích bài viết',
    example: 42,
  })
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({
    description: 'Thông tin bài viết được thích',
    type: () => Post,
  })
  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ApiProperty({
    description: 'Thông tin người dùng đã thích bài viết',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
