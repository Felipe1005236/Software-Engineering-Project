import { Test, TestingModule } from '@nestjs/testing';
import { TimeTrackingController } from './time-tracking.controller';

describe('TimeTrackingController', () => {
  let controller: TimeTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeTrackingController],
    }).compile();

    controller = module.get<TimeTrackingController>(TimeTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
