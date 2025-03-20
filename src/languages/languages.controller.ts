import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { PaginateDto } from '../utils/dto/paginate.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('flag'))
  create(
    @Body() createLanguageDto: CreateLanguageDto,
    @UploadedFile() flag: Express.Multer.File,
  ) {
    return this.languagesService.create(createLanguageDto, flag);
  }

  @Get()
  findAll(@Query() paginateDto: PaginateDto, @Query('name') name?: string) {
    return this.languagesService.findAll(paginateDto, name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('flag'))
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
    @UploadedFile() flag?: Express.Multer.File,
  ) {
    return this.languagesService.update(+id, updateLanguageDto, flag);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.languagesService.remove(+id);
  }
}
