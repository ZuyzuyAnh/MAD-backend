import { Module } from '@nestjs/common';
import { VocabGameResultsService } from './vocab_game_results.service';
import { VocabGameResultsController } from './vocab_game_results.controller';
import { ProgressService } from 'src/progress/progress.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabGameResult } from './entities/vocab_game_result.entity';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [TypeOrmModule.forFeature([VocabGameResult]), ProgressModule],
  controllers: [VocabGameResultsController],
  providers: [VocabGameResultsService],
  exports: [VocabGameResultsService],
})
export class VocabGameResultsModule {}
