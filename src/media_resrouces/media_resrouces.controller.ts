import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MediaResroucesService } from './media_resrouces.service';
import { CreateMediaResrouceDto } from './dto/create-media_resrouce.dto';
import { UpdateMediaResrouceDto } from './dto/update-media_resrouce.dto';

@Controller('media-resrouces')
export class MediaResroucesController {
  constructor(private readonly mediaResroucesService: MediaResroucesService) {}

  @Post()
  create(@Body() createMediaResrouceDto: CreateMediaResrouceDto) {
    return this.mediaResroucesService.create(createMediaResrouceDto);
  }

  @Get()
  findAll() {
    return this.mediaResroucesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaResroucesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaResrouceDto: UpdateMediaResrouceDto) {
    return this.mediaResroucesService.update(+id, updateMediaResrouceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaResroucesService.remove(+id);
  }
}
