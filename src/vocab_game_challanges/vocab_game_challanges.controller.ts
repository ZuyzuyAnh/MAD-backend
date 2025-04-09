import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VocabGameChallangesService } from './vocab_game_challanges.service';
import { CreateVocabGameChallangeDto } from './dto/create-vocab_game_challange.dto';
import { UpdateVocabGameChallangeDto } from './dto/update-vocab_game_challange.dto';

@Controller('vocab-game-challanges')
export class VocabGameChallangesController {
  constructor(private readonly vocabGameChallangesService: VocabGameChallangesService) {}

  @Post()
  create(@Body() createVocabGameChallangeDto: CreateVocabGameChallangeDto) {
    return this.vocabGameChallangesService.create(createVocabGameChallangeDto);
  }

  @Get()
  findAll() {
    return this.vocabGameChallangesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vocabGameChallangesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVocabGameChallangeDto: UpdateVocabGameChallangeDto) {
    return this.vocabGameChallangesService.update(+id, updateVocabGameChallangeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vocabGameChallangesService.remove(+id);
  }
}
