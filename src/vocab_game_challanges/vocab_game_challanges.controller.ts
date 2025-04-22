import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VocabGameChallangesService } from './vocab_game_challanges.service';
import { CreateVocabGameChallangeDto } from './dto/create-vocab_game_challange.dto';
import { UpdateVocabGameChallangeDto } from './dto/update-vocab_game_challange.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { VocabGameChallange } from './entities/vocab_game_challange.entity';

@ApiTags('Thử thách từ vựng')
@Controller('vocab-game-challanges')
export class VocabGameChallangesController {
  constructor(
    private readonly vocabGameChallangesService: VocabGameChallangesService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo thử thách từ vựng mới',
    description: 'Tạo một thử thách mới cho trò chơi từ vựng',
  })
  @ApiBody({
    type: CreateVocabGameChallangeDto,
    description: 'Dữ liệu để tạo thử thách từ vựng mới',
  })
  @ApiCreatedResponse({
    description: 'Thử thách từ vựng đã được tạo thành công',
    type: VocabGameChallange,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  create(@Body() createVocabGameChallangeDto: CreateVocabGameChallangeDto) {
    return this.vocabGameChallangesService.create(createVocabGameChallangeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy tất cả thử thách từ vựng',
    description: 'Lấy danh sách tất cả các thử thách từ vựng',
  })
  @ApiOkResponse({
    description: 'Danh sách thử thách từ vựng',
    type: [VocabGameChallange],
  })
  findAll() {
    return this.vocabGameChallangesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin thử thách từ vựng',
    description: 'Lấy thông tin chi tiết về một thử thách từ vựng cụ thể',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của thử thách từ vựng',
    type: 'number',
  })
  @ApiOkResponse({
    description: 'Thử thách từ vựng đã được tìm thấy',
    type: VocabGameChallange,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy thử thách từ vựng' })
  findOne(@Param('id') id: string) {
    return this.vocabGameChallangesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật thử thách từ vựng',
    description: 'Cập nhật thông tin thử thách từ vựng đã tồn tại',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của thử thách từ vựng cần cập nhật',
    type: 'number',
  })
  @ApiBody({
    type: UpdateVocabGameChallangeDto,
    description: 'Dữ liệu cập nhật cho thử thách từ vựng',
  })
  @ApiOkResponse({
    description: 'Thử thách từ vựng đã được cập nhật thành công',
    type: VocabGameChallange,
  })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy thử thách từ vựng' })
  update(
    @Param('id') id: string,
    @Body() updateVocabGameChallangeDto: UpdateVocabGameChallangeDto,
  ) {
    return this.vocabGameChallangesService.update(
      +id,
      updateVocabGameChallangeDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa thử thách từ vựng',
    description: 'Xóa một thử thách từ vựng khỏi hệ thống',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của thử thách từ vựng cần xóa',
    type: 'number',
  })
  @ApiOkResponse({ description: 'Thử thách từ vựng đã được xóa thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy thử thách từ vựng' })
  remove(@Param('id') id: string) {
    return this.vocabGameChallangesService.remove(+id);
  }
}
