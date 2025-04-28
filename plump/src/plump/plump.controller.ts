import { Controller, Get } from '@nestjs/common';
import { PlumpService } from './plump.service';

@Controller('plump')
export class PlumpController {
  constructor(private readonly plumpService: PlumpService) {}

  @Get()
  getPlumpData() {
    return this.plumpService.getPlumpData();  // Call the service to get data
  }
}
