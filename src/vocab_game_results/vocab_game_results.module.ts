import { Module } from '@nestjs/common';
import { VocabGameResultsService } from './vocab_game_results.service';
import { VocabGameResultsController } from './vocab_game_results.controller';

@Module({
  controllers: [VocabGameResultsController],
  providers: [VocabGameResultsService],
})
export class VocabGameResultsModule {}
