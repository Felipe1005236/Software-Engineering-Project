import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';

@Controller('calendar-events')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) {}

  @Get()
  findAll() {
    return this.calendarEventService.findAll();
  }

  @Post()
  create(@Body() createDto: any) {
    return this.calendarEventService.create(createDto);
  }

  @Delete()
  remove(@Body() deleteDto: { id: number }) {
    return this.calendarEventService.remove(deleteDto);
  }
} 