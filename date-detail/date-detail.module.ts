import { Module } from '@nestjs/common';
import { DateDetailController } from './date-detail.controller';
import { DateDetailService } from './date-detail.service';

@Module({
  controllers: [DateDetailController],
  providers: [DateDetailService],
})
export class DateDetailModule {}
