import { Module } from '@nestjs/common';
import { VocabGamesService } from './vocab_games.service';
import { VocabGamesController } from './vocab_games.controller';

@Module({
  controllers: [VocabGamesController],
  providers: [VocabGamesService],
})
export class VocabGamesModule {}
