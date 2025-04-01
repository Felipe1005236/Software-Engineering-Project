
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
//new controller that listens to requests at the '/error' route
@Controller('error')
export class ErrorController {
  // Handle GET /error and simulate a server-side failure
  @Get()
  triggerError() {
    
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR, 
      error: 'Global error test',                
      message: 'This is a simulated global error from the error module.' 
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}