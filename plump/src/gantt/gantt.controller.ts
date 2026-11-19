import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GanttService } from './gantt.service';
import { CreateGanttDto } from './dto/create-gantt.dto';
import { GanttResponseDto } from './dto/gantt-response.dto';

@Controller('projects/:projectId/gantt')
export class GanttController {
  constructor(private readonly ganttService: GanttService) {}

  @Post('dates')
  async setDates(
    @Param('projectId') projectId: string,
    @Body() dto: CreateGanttDto,
  ) {
    return this.ganttService.setGanttDates(parseInt(projectId), dto);
  }

  @Get()
  async getGanttData(
    @Param('projectId') projectId: string,
  ): Promise<GanttResponseDto> {
    return this.ganttService.getGanttData(parseInt(projectId));
  }
}