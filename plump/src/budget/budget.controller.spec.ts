import { Test, TestingModule } from '@nestjs/testing';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';  // Import BudgetService
import { PrismaService } from '../prisma/prisma.service';  // Import PrismaService

describe('BudgetController', () => {
  let controller: BudgetController;
  let service: BudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetController],  // We're testing BudgetController
      providers: [BudgetService, PrismaService],  // Add PrismaService as a provider
    }).compile();

    controller = module.get<BudgetController>(BudgetController);
    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
