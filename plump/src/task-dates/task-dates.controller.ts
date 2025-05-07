import { Controller, Post, Body } from '@nestjs/common';
import { TaskDatesService } from './task-dates.service';

@Controller('task-dates')
export class TaskDatesController {
  constructor(private readonly taskDatesService: TaskDatesService) {}

  @Post()
  create(@Body() body: { startDate: string; targetDate: string }) {
    return this.taskDatesService.create(body.startDate, body.targetDate);
  }
} 