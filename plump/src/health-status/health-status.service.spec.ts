import { Test, TestingModule } from '@nestjs/testing';
import { HealthStatusService } from './health-status.service';

describe('HealthStatusService', () => {
  let service: HealthStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthStatusService],
    }).compile();

    service = module.get<HealthStatusService>(HealthStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
