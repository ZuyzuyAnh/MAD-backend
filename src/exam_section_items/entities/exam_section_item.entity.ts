import { ExamSection } from 'src/exam_sections/entities/exam_section.entity';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('exam_section_items')
export class ExamSectionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'exam_section_id' })
  examSectionId: number;

  @Column({ name: 'question_id' })
  questionId: number;

  @Column({ name: 'sequence' })
  sequence: number;

  @ManyToOne(() => ExamSection)
  @JoinColumn({ name: 'exam_section_id' })
  examSection: ExamSection;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
