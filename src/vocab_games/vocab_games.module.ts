import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabGamesService } from './vocab_games.service';
import { VocabGamesController } from './vocab_games.controller';
import { VocabGame } from './entities/vocab_game.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ProgressModule } from 'src/progress/progress.module';
import { VocabGameChallange } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';
import { VocabGameChallangesModule } from 'src/vocab_game_challanges/vocab_game_challanges.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VocabGame]),
    LanguagesModule,
    ProgressModule,
    VocabGameChallangesModule,
  ],
  controllers: [VocabGamesController],
  providers: [VocabGamesService],
  exports: [VocabGamesService],
})
export class VocabGamesModule {}
