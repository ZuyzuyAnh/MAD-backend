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
import { VocabGamesService } from './vocab_games.service';
import { CreateVocabGameDto } from './dto/create-vocab_game.dto';
import { UpdateVocabGameDto } from './dto/update-vocab_game.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { VocabGameChallangeType } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { VocabGame } from './entities/vocab_game.entity';
import { VocabGameChallange } from 'src/vocab_game_challanges/entities/vocab_game_challange.entity';

@ApiTags('Trò chơi từ vựng')
@Controller('vocab-games')
export class VocabGamesController {
  constructor(private readonly vocabGamesService: VocabGamesService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo trò chơi từ vựng mới',
    description: 'Tạo một trò chơi từ vựng mới với chủ đề được chỉ định',
  })
  @ApiBody({
    type: CreateVocabGameDto,
    description: 'Dữ liệu để tạo trò chơi từ vựng mới',
  })
  @ApiCreatedResponse({
    description: 'Trò chơi từ vựng đã được tạo thành công',
    type: VocabGame,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  create(@Body() createVocabGameDto: CreateVocabGameDto) {
    return this.vocabGamesService.create(createVocabGameDto);
  }

  @Get(':id/challanges')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thử thách của trò chơi theo loại',
    description:
      'Lấy thử thách của trò chơi từ vựng được chỉ định theo loại thử thách',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của trò chơi từ vựng',
    type: 'number',
  })
  @ApiQuery({
    name: 'type',
    description: 'Loại thử thách',
    enum: VocabGameChallangeType,
    required: false,
  })
  @ApiOkResponse({
    description: 'Thử thách đã được tìm thấy',
    type: VocabGameChallange,
  })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy trò chơi hoặc thử thách',
  })
  findChallangeByGameIdAndType(
    @Param('id') vocabGameId: number,
    @Query('type') type: VocabGameChallangeType,
  ) {
    return this.vocabGamesService.findVocabGameChallangeByVocabGameAndType(
      vocabGameId,
      type,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách trò chơi từ vựng',
    description: 'Lấy danh sách tất cả các trò chơi từ vựng có phân trang',
  })
  @ApiQuery({
    name: 'page',
    description: 'Số trang',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Số lượng trên mỗi trang',
    type: Number,
    required: false,
  })
  @ApiOkResponse({
    description: 'Danh sách trò chơi từ vựng',
    type: [VocabGame],
  })
  @ApiUnauthorizedResponse({ description: 'Người dùng chưa đăng nhập' })
  findAll(@Query() paginateDto: PaginateDto, @GetUser('sub') userId: number) {
    return this.vocabGamesService.findAll(paginateDto, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy một trò chơi từ vựng',
    description: 'Lấy thông tin chi tiết về một trò chơi từ vựng cụ thể',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của trò chơi từ vựng',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Trò chơi từ vựng đã được tìm thấy',
    type: VocabGame,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy trò chơi từ vựng' })
  findOne(@Param('id') id: string) {
    return this.vocabGamesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật trò chơi từ vựng',
    description: 'Cập nhật thông tin trò chơi từ vựng đã tồn tại',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của trò chơi từ vựng cần cập nhật',
    type: 'number',
  })
  @ApiBody({
    type: UpdateVocabGameDto,
    description: 'Dữ liệu cập nhật cho trò chơi từ vựng',
  })
  @ApiOkResponse({
    description: 'Trò chơi từ vựng đã được cập nhật thành công',
    type: VocabGame,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy trò chơi từ vựng' })
  update(
    @Param('id') id: string,
    @Body() updateVocabGameDto: UpdateVocabGameDto,
  ) {
    return this.vocabGamesService.update(+id, updateVocabGameDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa trò chơi từ vựng',
    description: 'Xóa một trò chơi từ vựng khỏi hệ thống',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của trò chơi từ vựng cần xóa',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Trò chơi từ vựng đã được xóa thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy trò chơi từ vựng' })
  remove(@Param('id') id: string) {
    return this.vocabGamesService.remove(+id);
  }
}
