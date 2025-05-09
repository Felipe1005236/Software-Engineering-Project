import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateTimeEntryData {
  userID: number;
  projectID: number;
  dateWorked: Date;
  hoursSpent: number;
  mode?: 'overwrite' | 'accumulate';
}

@Injectable()
export class TimeTrackingService {
  constructor(private prisma: PrismaService) {}

  async createTimeEntry(data: CreateTimeEntryData) {
    // Set the date to the first day of the month
    const date = new Date(data.dateWorked);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);

    // Get the user's role from the project team
    const project = await this.prisma.project.findUnique({
      where: { projectID: data.projectID },
      include: {
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

    if (!project || !project.team) {
      throw new NotFoundException('Project or team not found');
    }

    // Find the user membership in the team
    const userMembership = project.team.members.find(m => m.user.userID === data.userID);
    if (!userMembership) {
      throw new NotFoundException('User is not part of the project team');
    }

    // Try to find existing entry for this user, project, and month
    const existingEntry = await this.prisma.timeTracking.findFirst({
      where: {
        userID: data.userID,
        projectID: data.projectID,
        dateWorked: date
      }
    });

    const mode = data.mode || 'overwrite';

    if (existingEntry) {
      let newHours = data.hoursSpent;
      if (mode === 'accumulate') {
        newHours = existingEntry.hoursSpent + data.hoursSpent;
      }
      return this.prisma.timeTracking.update({
        where: { timeTrackingID: existingEntry.timeTrackingID },
        data: {
          hoursSpent: newHours,
          role: userMembership.teamRole
        }
      });
    }

    // Create new entry
    return this.prisma.timeTracking.create({
      data: {
        userID: data.userID,
        projectID: data.projectID,
        dateWorked: date,
        hoursSpent: data.hoursSpent,
        role: userMembership.teamRole
      }
    });
  }

  async getMonthlyCapacity(userId: number, year: number) {
    const entries = await this.prisma.timeTracking.findMany({
      where: {
        userID: userId,
        dateWorked: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1)
        }
      },
      include: {
        project: true
      },
      orderBy: {
        dateWorked: 'asc'
      }
    });

    // Group by month and project
    const monthlyCapacity = entries.reduce((acc, entry) => {
      const month = entry.dateWorked.getMonth();
      const key = `${month}`;
      
      if (!acc[key]) {
        acc[key] = {};
      }
      
      if (!acc[key][entry.projectID]) {
        acc[key][entry.projectID] = {
          projectName: entry.project.title,
          hours: 0,
          role: entry.role
        };
      }
      
      acc[key][entry.projectID].hours += entry.hoursSpent;
      return acc;
    }, {});

    return monthlyCapacity;
  }

  async getAllEntries() {
    return this.prisma.timeTracking.findMany({
      include: {
        user: true,
        project: true
      },
      orderBy: {
        dateWorked: 'desc'
      }
    });
  }

  async getEntriesByUser(userId: number) {
    return this.prisma.timeTracking.findMany({
      where: { userID: userId },
      include: {
        project: true
      },
      orderBy: {
        dateWorked: 'desc'
      }
    });
  }

  async getEntriesByProject(projectId: number) {
    return this.prisma.timeTracking.findMany({
      where: { projectID: projectId },
      include: {
        user: true
      },
      orderBy: {
        dateWorked: 'desc'
      }
    });
  }
}