import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VocabGamesService } from './vocab_games.service';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';

@Controller('vocab-games')
export class VocabGamesController {
  constructor(private readonly vocabGamesService: VocabGamesService) {}

  @Post()
  create(@Body() createVocabGameDto: CreateVocabGameDto) {
    return this.vocabGamesService.create(createVocabGameDto);
  }

  @Get()
  findAll() {
    return this.vocabGamesService.findAll();
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
