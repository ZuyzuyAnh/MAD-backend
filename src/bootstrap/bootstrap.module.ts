import { Global, Module } from '@nestjs/common';
import { BootstrapService } from './bootstrap.service';
import { UsersModule } from 'src/users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
