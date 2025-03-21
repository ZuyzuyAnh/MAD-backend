import { Module } from '@nestjs/common';
import { VocabsService } from './vocabs.service';
import { VocabsController } from './vocabs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vocab } from './entities/vocab.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vocab])],
  controllers: [VocabsController],
  providers: [VocabsService],
})
export class VocabsModule {}
