import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private readonly usersService: UsersService) {
    this.logger.log('BootstrapService được khởi tạo');
  }

  async onModuleInit() {
    this.logger.log('Bắt đầu bootstrap dữ liệu...');

    try {
      await this.setupInitialData();

      this.logger.log('Bootstrap dữ liệu thành công!');
    } catch (error) {
      this.logger.error(`Bootstrap thất bại: ${error.message}`, error.stack);
    }
  }

  private async setupInitialData(): Promise<void> {
    this.logger.log('Đang thiết lập dữ liệu ban đầu...');
    const users = await this.usersService.findAll(
      { page: 1, limit: 1 },
      'admin',
      UserRole.ADMIN,
    );

    if (users.data.length === 0) {
      await this.usersService.create({
        first_name: 'Admin',
        last_name: 'Admin',
        username: 'admin',
        email: 'admin@learning.com',
        password: 'Admin@123',
        role: UserRole.ADMIN,
      });
    }
    this.logger.log('Thiết lập dữ liệu ban đầu thành công');
  }
}
