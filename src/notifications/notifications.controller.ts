import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
  } from '@nestjs/common';
  import { NotificationsService } from './notifications.service';
  import { CreateNotificationDto } from './dto/create-notification.dto';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { GetUser } from 'src/auth/decorators/get-user.decorator';
  import { PaginateDto } from '../common/dto/paginate.dto';
  import AppResponse from '../common/dto/api-response.dto';
  import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';
  
  @Controller('notifications')
  export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @AdminOnly()
    async create(
      @Body() createNotificationDto: CreateNotificationDto,
      @Query('userId') userId?: number,
    ) {
       const notification = await this.notificationsService.create(
      createNotificationDto,
      userId,
    );
    
    return AppResponse.successWithData({
      data: notification,
      message: userId 
        ? 'Tạo thông báo thành công cho người dùng' 
        : 'Tạo thông báo thành công cho tất cả người dùng',
    });
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
      @GetUser('sub') userId: number,
      @Query() paginateDto: PaginateDto,
    ) {
      const result = await this.notificationsService.findAll(userId, paginateDto);
      return AppResponse.successWithData({
        data: result,
      });
    }
  
    @Get('unread-count')
    @UseGuards(JwtAuthGuard)
    async getUnreadCount(@GetUser('sub') userId: number) {
      const count = await this.notificationsService.getUnreadCount(userId);
      return AppResponse.successWithData({
        data: { count },
      });
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string) {
      const notification = await this.notificationsService.findOne(+id);
      return AppResponse.successWithData({
        data: notification,
      });
    }
  
    @Patch(':id/read')
    @UseGuards(JwtAuthGuard)
    async markAsRead(@Param('id') id: string) {
      const notification = await this.notificationsService.markAsRead(+id);
      return AppResponse.successWithData({
        data: notification,
        message: 'Đánh dấu đã đọc thông báo thành công',
      });
    }
  
    @Patch('read-all')
    @UseGuards(JwtAuthGuard)
    async markAllAsRead(@GetUser('sub') userId: number) {
      await this.notificationsService.markAllAsRead(userId);
      return AppResponse.success('Đánh dấu tất cả thông báo đã đọc');
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
      await this.notificationsService.remove(+id);
      return AppResponse.success('Xóa thông báo thành công');
    }
  }