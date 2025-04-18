import { Module } from '@nestjs/common';
import { VocabGameResultsService } from './vocab_game_results.service';
import { VocabGameResultsController } from './vocab_game_results.controller';
import { ProgressService } from 'src/progress/progress.service';

@Module({
  controllers: [VocabGameResultsController, ProgressService],
  providers: [VocabGameResultsService],
})
export class VocabGameResultsModule {}
