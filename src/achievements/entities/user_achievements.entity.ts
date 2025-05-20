import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Achievement } from './achievement.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('user_achievements')
@Unique(['user', 'achievement'])
export class UserAchievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'achievement_id' })
  achievementId: number;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  @ManyToOne(() => User, (user) => user.userAchievements)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  unlockedAt: Date;
}
