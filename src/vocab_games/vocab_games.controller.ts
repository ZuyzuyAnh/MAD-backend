import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VocabGamesService } from './vocab_games.service';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('vocab-games')
export class VocabGamesController {
  constructor(private readonly vocabGamesService: VocabGamesService) {}

  @Post()
  create(@Body() createVocabGameDto: CreateVocabGameDto) {
    return this.vocabGamesService.create(createVocabGameDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() paginateDto: PaginateDto, @GetUser('sub') userId: number) {
    return this.vocabGamesService.findAll(paginateDto, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabGamesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVocabGameDto: UpdateVocabGameDto,
  ) {
    return this.vocabGamesService.update(+id, updateVocabGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabGamesService.remove(+id);
  }
}
