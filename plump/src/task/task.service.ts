import { Injectable } from '@nestjs/common';
import { Task } from './task.interface';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];
  private idCounter = 1;

  getAll(): Task[] {
    return this.tasks;
  }

  getOne(id: number): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  create(title: string, description: string): Task {
    const newTask: Task = {
      id: this.idCounter++,
      title,
      description,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  update(id: number, updates: Partial<Task>): Task | undefined {
    const task = this.getOne(id);
    if (task) {
      Object.assign(task, updates);
    }
    return task;
  }

  delete(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
