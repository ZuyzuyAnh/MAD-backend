import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column({ name: 'is_current_active', default: true })
  isCurrentActive: boolean;
}
