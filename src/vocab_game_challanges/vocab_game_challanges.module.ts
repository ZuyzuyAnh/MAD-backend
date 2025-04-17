import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabGameChallangesService } from './vocab_game_challanges.service';
import { VocabGameChallangesController } from './vocab_game_challanges.controller';
import { VocabGameChallange } from './entities/vocab_game_challange.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VocabGameChallange])],
  controllers: [VocabGameChallangesController],
  providers: [VocabGameChallangesService],
})
export class VocabGameChallangesModule {}
