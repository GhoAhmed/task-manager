import { Injectable } from '@angular/core';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';

  getTasks(): Task[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const tasks = JSON.parse(stored);
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    }
    return [];
  }

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date(),
    };
    return newTask;
  }

  updateTask(tasks: Task[], updatedTask: Task): Task[] {
    return tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  deleteTask(tasks: Task[], id: number): Task[] {
    return tasks.filter((task) => task.id !== id);
  }

  toggleComplete(task: Task): Task {
    return { ...task, completed: !task.completed };
  }
}
