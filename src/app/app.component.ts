import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from './core/interfaces/task';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  taskTitle = '';
  taskDescription = '';
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  saveTask(): void {
    if (!this.taskTitle.trim()) {
      return;
    }

    if (this.editingTask) {
      this.editingTask.title = this.taskTitle.trim();
      this.editingTask.description = this.taskDescription.trim();
      this.tasks = this.taskService.updateTask(this.tasks, this.editingTask);
      this.editingTask = null;
    } else {
      const newTask = this.taskService.addTask({
        title: this.taskTitle.trim(),
        description: this.taskDescription.trim(),
        completed: false,
      });
      this.tasks.push(newTask);
    }

    this.clearForm();
    this.taskService.saveTasks(this.tasks);
  }

  toggleCompletion(task: Task): void {
    const updatedTask = this.taskService.toggleComplete(task);
    this.tasks = this.taskService.updateTask(this.tasks, updatedTask);
    this.taskService.saveTasks(this.tasks);
  }

  deleteTask(id: number): void {
    this.tasks = this.taskService.deleteTask(this.tasks, id);
    this.taskService.saveTasks(this.tasks);
  }

  editTask(task: Task): void {
    this.editingTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
  }

  cancelEdit(): void {
    this.clearForm();
    this.editingTask = null;
  }

  clearForm(): void {
    this.taskTitle = '';
    this.taskDescription = '';
  }

  get completedTasksCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingTasksCount(): number {
    return this.tasks.filter((task) => !task.completed).length;
  }
}
