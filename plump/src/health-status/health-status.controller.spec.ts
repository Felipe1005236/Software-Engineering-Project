import { Test, TestingModule } from '@nestjs/testing';
import { HealthStatusController } from './health-status.controller';

describe('HealthStatusController', () => {
  let controller: HealthStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthStatusController],
    }).compile();

    controller = module.get<HealthStatusController>(HealthStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
