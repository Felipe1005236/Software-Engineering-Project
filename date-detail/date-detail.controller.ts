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
import { DateDetailService } from './date-detail.service';
import { DateRecord } from './date-record.interface';

@Controller('dates')
export class DateDetailController {
  constructor(private readonly dateService: DateDetailService) {}

  @Get()
  getAll(): DateRecord[] {
    return this.dateService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): DateRecord {
    return this.dateService.getOne(id);
  }

  @Post()
  create(@Body() body: { name: string; date: string }): DateRecord {
    return this.dateService.create(body.name, body.date);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updates: Partial<DateRecord>,
  ): DateRecord {
    return this.dateService.update(id, updates);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): { message: string } {
    this.dateService.delete(id);
    return { message: 'Date record deleted' };
  }
}
