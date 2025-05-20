import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpeakingDataService } from './speaking_data.service';
import { SpeakingDataController } from './speaking_data.controller';
import { SpeakingDatum } from './entities/speaking_datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpeakingDatum])],
  controllers: [SpeakingDataController],
  providers: [SpeakingDataService],
  exports: [SpeakingDataService],
})
export class SpeakingDataModule {}
