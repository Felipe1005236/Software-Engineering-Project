import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, ParseIntPipe, Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Status } from '@prisma/client';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(@Query('projectID') projectID?: string) {
    return this.taskService.getAll(projectID ? parseInt(projectID) : undefined);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getOne(id);
  }

  @Post()
  create(@Body() body: {
    title: string;
    details: string;
    projectID: number;
    userID: number;
    status: Status;
    percentageComplete: number;
    priority: string;
    startDate: string;
    targetDate: string;
  }) {
    return this.taskService.create(
      body.title,
      body.details,
      body.projectID,
      body.userID,
      body.status,
      body.percentageComplete,
      body.priority,
      body.startDate,
      body.targetDate
    );
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updates: any) {
    return this.taskService.update(id, updates);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
