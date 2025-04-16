import { Injectable } from '@nestjs/common';
import { CreateExamSectionItemDto } from './dto/create-exam_section_item.dto';
import { UpdateExamSectionItemDto } from './dto/update-exam_section_item.dto';

@Injectable()
export class ExamSectionItemsService {
  create(createExamSectionItemDto: CreateExamSectionItemDto) {
    return 'This action adds a new examSectionItem';
  }

  findAll() {
    return `This action returns all examSectionItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} examSectionItem`;
  }

  update(id: number, updateExamSectionItemDto: UpdateExamSectionItemDto) {
    return `This action updates a #${id} examSectionItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} examSectionItem`;
  }
}
