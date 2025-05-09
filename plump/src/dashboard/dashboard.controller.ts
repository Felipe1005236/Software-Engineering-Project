import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  @Get()
  getDashboardData() {
    return {
      stats: [
        { title: 'Total Tasks', value: 128, icon: 'tasks' },
        { title: 'Completed', value: 96, icon: 'completed' },
        { title: 'In Progress', value: 24, icon: 'progress' },
        { title: 'High Priority', value: 8, icon: 'priority' },
      ],
      activity: [
        { emoji: '✅', text: 'Milicia completed "Set up backend auth"', time: '2h ago' },
        { emoji: '⚠️', text: 'Stefan updated priority for "Apollo"', time: '4h ago' },
        { emoji: '🗓️', text: 'Bisera created "Client feedback review"', time: 'Yesterday' },
        { emoji: '💬', text: 'Saim commented on "Task view redesign"', time: '2 days ago' },
      ],
      team: [
        { name: 'Alice', status: 'Online', tasks: 5 },
        { name: 'Javier', status: 'Idle', tasks: 2 },
        { name: 'Kavya', status: 'Offline', tasks: 7 },
      ],
    };
  }
}
