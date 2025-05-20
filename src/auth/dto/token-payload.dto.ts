import { UserRole } from '../../users/entities/user.entity';

export class TokenPayloadDto {
  sub: number;
  role: UserRole;
}
