import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaResrouceDto } from './create-media_resrouce.dto';

export class UpdateMediaResrouceDto extends PartialType(CreateMediaResrouceDto) {}
