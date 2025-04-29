import { PartialType } from '@nestjs/swagger';
import { CreateSpeakingDatumDto } from './create-speaking_datum.dto';

export class UpdateSpeakingDatumDto extends PartialType(
  CreateSpeakingDatumDto,
) {}
