import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetService {
    constructor(private prisma: PrismaService){}

    async create(CreateBudgetDto: CreateBudgetDto){
        return this.prisma.budget.create({
            data: CreateBudgetDto,
        })
    }

    async findAll(){
        return this.prisma.budget.findMany();
    }

    async findOne(budgetID: number){
        return this.prisma.budget.findUnique({
            where: { budgetID },
        })
    }

    async update(budgetID: number, updateBudgetDto: UpdateBudgetDto) {
        return this.prisma.budget.update({
          where: { budgetID },
          data: updateBudgetDto,
        });
      }
    
    async remove(budgetID: number) {
      return this.prisma.budget.delete({
        where: { budgetID },
      });
    }
}