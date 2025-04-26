import { Injectable } from '@nestjs/common';

@Injectable()
export class PlumpService {
  getPlumpData() {
    // Example method to return data or perform some logic
    return { message: 'This is a sample Plump service response.' };
  }
}
