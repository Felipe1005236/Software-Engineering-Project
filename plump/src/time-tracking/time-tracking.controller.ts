import { Body, Controller, Get, Post } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto'; 

@Controller('time-tracking')
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Post()
  async trackTime(@Body() dto: CreateTimeEntryDto) {
    const { userID, projectID, taskID, workedDate, hoursWorked, description, role } = dto;

    return this.timeTrackingService.createTimeEntry({
      dateWorked: new Date(workedDate),
      hoursSpent: hoursWorked, // Changed from hoursWorked to hoursSpent
      description,
      role, // Added role
      user: { connect: { userID } },
      project: { connect: { projectID } },
      ...(taskID && { task: { connect: { taskID } } }),
    });
  }

  @Get()
  async getAll() {
    return this.timeTrackingService.getAllEntries();
  }
}