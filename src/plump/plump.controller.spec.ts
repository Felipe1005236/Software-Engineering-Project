import { Test, TestingModule } from '@nestjs/testing';
import { PlumpController } from './plump.controller';
import { PlumpService } from './plump.service';  // Ensure PlumpService is imported

describe('PlumpController', () => {
  let controller: PlumpController;
  let service: PlumpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlumpController],
      providers: [PlumpService],  // Ensure PlumpService is added as a provider
    }).compile();

    controller = module.get<PlumpController>(PlumpController);
    service = module.get<PlumpService>(PlumpService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return data from service', () => {
    const result = { message: 'This is a sample Plump service response.' };
    jest.spyOn(service, 'getPlumpData').mockReturnValue(result);

    expect(controller.getPlumpData()).toBe(result);
  });
});
