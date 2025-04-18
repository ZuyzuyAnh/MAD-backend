import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabGamesService } from './vocab_games.service';
import { VocabGamesController } from './vocab_games.controller';
import { VocabGame } from './entities/vocab_game.entity';
import { LanguagesModule } from 'src/languages/languages.module';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VocabGame]),
    LanguagesModule,
    ProgressModule,
  ],
  controllers: [VocabGamesController],
  providers: [VocabGamesService],
  exports: [VocabGamesService],
})
export class VocabGamesModule {}
