import { Test, TestingModule } from '@nestjs/testing';
import { GanttService } from './gantt.service';

describe('GanttService', () => {
  let service: GanttService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GanttService],
    }).compile();

    service = module.get<GanttService>(GanttService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
