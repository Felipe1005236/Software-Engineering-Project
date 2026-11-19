import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma, Status, Phase } from '@prisma/client'; 
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Create a new project
  async create(createProjectDto: CreateProjectDto) {
    const { teamId, title, status, phase, startDate, targetDate } = createProjectDto;

    // Create the project first
    const project = await this.prisma.project.create({
      data: {
        title,
        status,
        phase,
        team: { connect: { teamID: teamId } },
      },
    });

    // If dates are provided, create ProjectDates and link to project
    if (startDate && targetDate) {
      await this.prisma.projectDates.create({
        data: {
          startDate: new Date(startDate),
          targetDate: new Date(targetDate),
          project: { connect: { projectID: project.projectID } },
        },
      });
    }

    // Return the full project with dates
    return this.findOne(project.projectID);
  }  

  // Get all projects
  findAll(where?: any) {
    return this.prisma.project.findMany({
      where,
      include: {
        team: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        },
        budget: true,
        health: true,
        dates: true
      }
    });
  }

  // Get one project by ID
  async findOne(projectID: number) {
    return this.prisma.project.findUnique({
      where: { projectID },
      include: {
        budget: true,
        health: true,
        dates: true,
        tasks: {
          orderBy: {
            taskID: 'desc'
          }
        },
        team: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  // Update a project by ID
  async update(projectID: number, updateProjectDto: UpdateProjectDto) {
    const { teamId, startDate, targetDate, health, ...rest } = updateProjectDto;
    
    // Update project dates if provided
    if (startDate || targetDate) {
      await this.prisma.projectDates.upsert({
        where: {
          projectID: projectID
        },
        create: {
          projectID: projectID,
          startDate: startDate ? new Date(startDate) : new Date(),
          targetDate: targetDate ? new Date(targetDate) : new Date()
        },
        update: {
          startDate: startDate ? new Date(startDate) : undefined,
          targetDate: targetDate ? new Date(targetDate) : undefined
        }
      });
    }

    // Update health status if provided
    if (health) {
      await this.prisma.healthStatus.upsert({
        where: {
          projectID: projectID
        },
        create: {
          projectID: projectID,
          scope: health.scope || 'GREEN',
          schedule: health.schedule || 'GREEN',
          cost: health.cost || 'GREEN',
          resource: health.resource || 'GREEN',
          overall: health.overall || 'GREEN'
        },
        update: {
          scope: health.scope,
          schedule: health.schedule,
          cost: health.cost,
          resource: health.resource,
          overall: health.overall
        }
      });
    }
    
    return this.prisma.project.update({
      where: { projectID },
      data: {
        ...rest,
        ...(teamId && {
          team: { connect: { teamID: teamId } }
        })
      },
      include: {
        budget: true,
        health: true,
        dates: true,
        team: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  // Delete a project by ID
  async remove(projectID: number) {
    return this.prisma.project.delete({
      where: { projectID },
    });
  }
  
  // Search support filters: name, status, date range
  async searchProjects(filters: {
    title?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.project.findMany({
      where: {
        ...(filters.title && {
          title: {
            contains: filters.title,
          },
        }),
        ...(filters.status && {
          status: {
            equals: filters.status as any,
          },
        }),
        ...(filters.startDate && filters.endDate && {
          dates: {
            startDate: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          },
        }),
      },
      include: {
        dates: true,
      },
    });
  }

  async exportProjectData(response: Response) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projects Report');
  
    worksheet.columns = [
      { header: 'Project Name', key: 'title', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Phase', key: 'phase', width: 20 },
      { header: 'Budget (Total)', key: 'budget', width: 20 },
      { header: 'Actual Cost', key: 'actualCost', width: 20 },
      { header: 'Forecast Cost', key: 'forecastCost', width: 20 },
      { header: 'Health Status (Overall)', key: 'health', width: 25 },
      { header: 'Start Date', key: 'startDate', width: 20 },
      { header: 'Actual Completion', key: 'actualCompletion', width: 25 },
    ];
  
    const projects = await this.prisma.project.findMany({
      include: {
        budget: true,
        health: true,
        dates: true,
      },
    });
  
    projects.forEach(project => {
      worksheet.addRow({
        title: project.title,
        status: project.status,
        phase: project.phase,
        budget: project.budget?.totalBudget?.toFixed(2) ?? 'N/A',
        actualCost: project.budget?.actualCost?.toFixed(2) ?? 'N/A',
        forecastCost: project.budget?.forecastCost?.toFixed(2) ?? 'N/A',
        health: project.health?.overall ?? 'N/A',
        startDate: project.dates?.startDate?.toISOString().split('T')[0] ?? 'N/A',
        actualCompletion: project.dates?.actualCompletion?.toISOString().split('T')[0] ?? 'N/A',
      });
    });
  
    // Optional styling
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF28A745' },
    };
    headerRow.alignment = { horizontal: 'center' };
  
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=projects_report.xlsx');
  
    await workbook.xlsx.write(response);
    response.end();
  }
}  