import { Controller, Get, Post, Body } from '@nestjs/common';
import { KanbanColumnService } from './kanban-column.service';
import { CreateKanbanColumnDto } from './dto/create-kanban-column.dto';

@Controller('api/kanban-columns')
export class KanbanColumnController {
  constructor(private readonly kanbanColumnService: KanbanColumnService) {}

  @Post()
  create(@Body() dto: CreateKanbanColumnDto) {
    return this.kanbanColumnService.create(dto);
  }

  @Get()
  findAll() {
    return this.kanbanColumnService.findAll();
  }
}
