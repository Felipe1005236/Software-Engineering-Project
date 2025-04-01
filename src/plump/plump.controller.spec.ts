import { Test, TestingModule } from '@nestjs/testing';
import { PlumpController } from './plump.controller';

describe('PlumpController', () => {
  let controller: PlumpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlumpController],
    }).compile();

    controller = module.get<PlumpController>(PlumpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
