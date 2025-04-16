import { Injectable } from '@nestjs/common';
import { CreateExamSectionDto } from './dto/create-exam_section.dto';
import { UpdateExamSectionDto } from './dto/update-exam_section.dto';

@Injectable()
export class ExamSectionsService {
  create(createExamSectionDto: CreateExamSectionDto) {
    return 'This action adds a new examSection';
  }

  findAll() {
    return `This action returns all examSections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examSection`;
  }

  update(id: number, updateExamSectionDto: UpdateExamSectionDto) {
    return `This action updates a #${id} examSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} examSection`;
  }
}
