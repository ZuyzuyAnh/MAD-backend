import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { PaginateDto } from '../common/dto/paginate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProgressDto: CreateProgressDto,
    @GetUser('sub') id: number,
  ) {
    return this.progressService.create(id, createProgressDto);
  }

  @Get()
  findAll(
    @Query() paginateDto: PaginateDto,
    @Query('userId') userId?: number,
    @Query('languageId') languageId?: number,
  ) {
    return this.progressService.findAll(paginateDto, userId, languageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(+id);
  }

  @Get('user/:userId/language/:languageId')
  findByUserAndLanguage(
    @Param('userId') userId: string,
    @Param('languageId') languageId: string,
  ) {
    return this.progressService.findByUserAndLanguage(+userId, +languageId);
  }

  @Post('user/:userId/language/:languageId/streak')
  updateStreak(
    @Param('userId') userId: string,
    @Param('languageId') languageId: string,
  ) {
    return this.progressService.updateStreak(+userId, +languageId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(+id, updateProgressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.progressService.remove(+id);
  }
}
