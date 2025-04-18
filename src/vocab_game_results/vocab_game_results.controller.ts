import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabGameResultsService } from './vocab_game_results.service';
import { CreateVocabGameResultDto } from './dto/create-vocab_game_result.dto';
import { UpdateVocabGameResultDto } from './dto/update-vocab_game_result.dto';

@Controller('vocab-game-results')
export class VocabGameResultsController {
  constructor(private readonly vocabGameResultsService: VocabGameResultsService) {}

  @Post()
  create(@Body() createVocabGameResultDto: CreateVocabGameResultDto) {
    return this.vocabGameResultsService.create(createVocabGameResultDto);
  }

  @Get()
  findAll() {
    return this.vocabGameResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabGameResultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabGameResultDto: UpdateVocabGameResultDto) {
    return this.vocabGameResultsService.update(+id, updateVocabGameResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabGameResultsService.remove(+id);
  }
}
