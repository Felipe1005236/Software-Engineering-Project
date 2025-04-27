import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';

@Controller('health-status')
export class HealthStatusController {
  constructor(private readonly healthStatusService: HealthStatusService) {}

  @Post()
  create(@Body() createHealthStatusDto: CreateHealthStatusDto) {
    return this.healthStatusService.create(createHealthStatusDto);
  }

  @Get()
  findAll() {
    return this.healthStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.healthStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHealthStatusDto: UpdateHealthStatusDto
  ) {
    return this.healthStatusService.update(id, updateHealthStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.healthStatusService.remove(id);
  }
}