import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRole } from '../../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';

export function AdminOnly() {
  return applyDecorators(
    SetMetadata('roles', [UserRole.ADMIN]),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Chưa xác thực' }),
    ApiForbiddenResponse({
      description: 'Không có quyền truy cập, chỉ ADMIN mới được phép',
    }),
  );
}
