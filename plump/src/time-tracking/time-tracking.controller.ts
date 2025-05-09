import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

@Controller('time-tracking')
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Post()
  async trackTime(@Body() dto: CreateTimeEntryDto) {
    const { userID, projectID, dateWorked, hoursSpent, mode } = dto;

    const timeEntryData = {
      userID,
      projectID,
      dateWorked: new Date(dateWorked),
      hoursSpent,
      mode,
    };

    return this.timeTrackingService.createTimeEntry(timeEntryData);
  }

  @Get('monthly-capacity')
  async getMonthlyCapacity(
    @Query('userId') userId: number,
    @Query('year') year: number = new Date().getFullYear()
  ) {
    return this.timeTrackingService.getMonthlyCapacity(userId, year);
  }

  @Get()
  async getAll() {
    return this.timeTrackingService.getAllEntries();
  }
}