import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabGamesService } from './vocab_games.service';
import { VocabGamesController } from './vocab_games.controller';
import { VocabGame } from './entities/vocab_game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VocabGame])],
  controllers: [VocabGamesController],
  providers: [VocabGamesService],
})
export class VocabGamesModule {}
