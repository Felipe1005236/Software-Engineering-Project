import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('units')
@UseGuards(JwtAuthGuard)
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  async create(@Body() createUnitDto: CreateUnitDto, @Request() req) {
    try {
      console.log('Received create unit request:', { createUnitDto, user: req.user });
      // Only set the creator as the manager if no managerID is provided
      if (!createUnitDto.managerID) {
        createUnitDto.managerID = req.user.userID;
      }
      console.log('Updated createUnitDto with managerID:', createUnitDto);
      const unit = await this.unitService.create(createUnitDto);
      console.log('Unit created successfully:', unit);

      // Update the manager's unitID
      if (unit.unitID && unit.managerID) {
        await this.prisma.user.update({
          where: { userID: unit.managerID },
          data: { unitID: unit.unitID }
        });
      }

      return unit;
    } catch (error) {
      console.error('Error in unit creation:', error);
      throw new InternalServerErrorException(`Failed to create unit: ${error.message}`);
    }
  }

  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitService.findOne(+id);
  }

  @Get('organization/:organizationId')
  findByOrganization(@Param('organizationId') organizationId: string) {
    return this.unitService.findByOrganization(+organizationId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitService.update(+id, updateUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(+id);
  }

  @Get(':id/teams')
  async getTeamsByUnit(@Param('id') id: string) {
    return this.unitService.findTeamsByUnit(+id);
  }
} 