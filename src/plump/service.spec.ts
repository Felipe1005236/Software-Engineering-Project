import { Test, TestingModule } from '@nestjs/testing';
import { PlumpService } from './plump.service';

 describe('PlumpService', () => {
   let service: PlumpService;

   beforeEach(async () => {
     const module: TestingModule = await Test.createTestingModule({
       providers: [PlumpService],
     }).compile();

     service = module.get<PlumpService>(PlumpService);
   });

   it('should be defined', () => {
     expect(service).toBeDefined();
   });
 });