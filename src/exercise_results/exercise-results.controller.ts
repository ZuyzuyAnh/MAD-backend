import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExerciseResultsService } from './exercise-results.service';
import { CreateExerciseResultDto } from './dto/create-exercise-result.dto';
import { UpdateExerciseResultDto } from './dto/update-exercise-result.dto';

@Controller('exercise-results')
export class ExerciseResultsController {
  constructor(
    private readonly exerciseResultsService: ExerciseResultsService,
  ) {}
}
