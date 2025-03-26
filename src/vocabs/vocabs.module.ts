import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabsService } from './vocabs.service';
import { VocabsController } from './vocabs.controller';
import { Vocab } from './entities/vocab.entity';
import { AwsModule } from '../aws/aws.module';

/**
 * Module quản lý các từ vựng trong hệ thống
 */
@Module({
  imports: [TypeOrmModule.forFeature([Vocab]), AwsModule],
  controllers: [VocabsController],
  providers: [VocabsService],
  exports: [VocabsService],
})
export class VocabsModule {}
