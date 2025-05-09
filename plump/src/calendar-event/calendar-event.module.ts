import { Module } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CalendarEventController],
  providers: [CalendarEventService],
})
export class CalendarEventModule {} 