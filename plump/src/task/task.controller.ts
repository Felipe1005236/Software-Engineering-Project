import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll() {
    return this.taskService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getOne(id);
  }

  @Post()
  create(@Body() body: { title: string; description: string }) {
    return this.taskService.create(body.title, body.description);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updates: any) {
    return this.taskService.update(id, updates);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.taskService.delete(id);
    return { message: 'Task deleted successfully' };
  }
}
