import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthStatusService } from './health-status.service';
import { CreateHealthStatusDto } from './dto/create-health-status.dto';
import { UpdateHealthStatusDto } from './dto/update-health-status.dto';
import { HealthStatus } from './interfaces/health-status.interface';

@Controller('health')
export class HealthStatusController {
  constructor(private readonly healthStatusService: HealthStatusService) {}

  @Post()
  create(@Body() createHealthStatusDto: CreateHealthStatusDto): HealthStatus {
    return this.healthStatusService.create(createHealthStatusDto);
  }

  @Get()
  findAll(): HealthStatus[] {
    return this.healthStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): HealthStatus | null {
    return this.healthStatusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHealthStatusDto: UpdateHealthStatusDto,
  ): HealthStatus | null {
    return this.healthStatusService.update(id, updateHealthStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { deleted: boolean } {
    return this.healthStatusService.remove(id);
  }
}