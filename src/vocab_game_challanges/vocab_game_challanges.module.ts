import { Module } from '@nestjs/common';
import { VocabGameChallangesService } from './vocab_game_challanges.service';
import { VocabGameChallangesController } from './vocab_game_challanges.controller';

@Module({
  controllers: [VocabGameChallangesController],
  providers: [VocabGameChallangesService],
})
export class VocabGameChallangesModule {}
