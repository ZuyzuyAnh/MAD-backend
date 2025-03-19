import { Injectable } from '@nestjs/common';
import { CreateMediaResrouceDto } from './dto/create-media_resrouce.dto';
import { UpdateMediaResrouceDto } from './dto/update-media_resrouce.dto';

@Injectable()
export class MediaResroucesService {
  create(createMediaResrouceDto: CreateMediaResrouceDto) {
    return 'This action adds a new mediaResrouce';
  }

  findAll() {
    return `This action returns all mediaResrouces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mediaResrouce`;
  }

  update(id: number, updateMediaResrouceDto: UpdateMediaResrouceDto) {
    return `This action updates a #${id} mediaResrouce`;
  }

  remove(id: number) {
    return `This action removes a #${id} mediaResrouce`;
  }
}
