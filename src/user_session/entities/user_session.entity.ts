import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_sessions')
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'login_time', nullable: true })
  loginTime: Date;

  @Column({ name: 'logout_time', nullable: true })
  logoutTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
