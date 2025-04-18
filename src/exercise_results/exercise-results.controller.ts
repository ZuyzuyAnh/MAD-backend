import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExerciseResultsService } from './exercise-results.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateExerciseResultDto } from './dto/create-exercise-result.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('exercise-results')
export class ExerciseResultsController {
  constructor(
    private readonly exerciseResultsService: ExerciseResultsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createExerciseResultDto: CreateExerciseResultDto,
    @GetUser('sub') userId: number,
  ) {
    return this.exerciseResultsService.create(userId, createExerciseResultDto);
  }
}
