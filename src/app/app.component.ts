import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Interface for a Task
interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>📝 To-Do List</h1>

      <!-- Add / Edit Task Form -->
      <form (ngSubmit)="saveTask()" class="task-form">
        <input
          type="text"
          [(ngModel)]="taskTitle"
          name="title"
          placeholder="Task title"
          required
        />
        <textarea
          [(ngModel)]="taskDescription"
          name="description"
          placeholder="Task description"
        ></textarea>
        <button type="submit">
          {{ editingTask ? 'Update Task' : 'Add Task' }}
        </button>
        <button *ngIf="editingTask" type="button" (click)="cancelEdit()">
          Cancel
        </button>
      </form>

      <!-- Task List -->
      <div *ngIf="tasks.length > 0; else noTasks">
        <ul class="task-list">
          <li *ngFor="let task of tasks" [class.completed]="task.completed">
            <div class="task-content">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
            </div>

            <div class="task-actions">
              <button (click)="toggleCompletion(task)">
                {{ task.completed ? 'Undo' : 'Complete' }}
              </button>
              <button (click)="editTask(task)">Edit</button>
              <button (click)="deleteTask(task.id)">Delete</button>
            </div>
          </li>
        </ul>
      </div>

      <ng-template #noTasks>
        <p class="no-tasks">No tasks yet. Add one above!</p>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        margin: 40px auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', sans-serif;
      }
      h1 {
        text-align: center;
        margin-bottom: 20px;
      }
      .task-form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      input,
      textarea {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
      }
      button {
        background-color: #1976d2;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      button:hover {
        background-color: #135ba1;
      }
      .task-list {
        list-style: none;
        padding: 0;
        margin-top: 20px;
      }
      .task-list li {
        background: white;
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border: 1px solid #eee;
        transition: transform 0.2s;
      }
      .task-list li:hover {
        transform: translateY(-2px);
      }
      .task-content {
        max-width: 70%;
      }
      .task-content h3 {
        margin: 0;
        font-size: 16px;
        color: #333;
      }
      .task-content p {
        margin: 5px 0 0;
        color: #666;
        font-size: 14px;
      }
      .task-actions button {
        margin-left: 5px;
        font-size: 13px;
      }
      .completed h3,
      .completed p {
        text-decoration: line-through;
        color: gray;
      }
      .no-tasks {
        text-align: center;
        color: #999;
        font-style: italic;
      }
    `,
  ],
})
export class AppComponent {
  tasks: Task[] = [];
  taskTitle: string = '';
  taskDescription: string = '';
  editingTask: Task | null = null;

  constructor() {
    this.loadTasks();
  }

  /** Save a new or edited task */
  saveTask() {
    if (this.editingTask) {
      // Update existing task
      this.editingTask.title = this.taskTitle;
      this.editingTask.description = this.taskDescription;
      this.editingTask = null;
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now(),
        title: this.taskTitle,
        description: this.taskDescription,
        completed: false,
      };
      this.tasks.push(newTask);
    }
    this.clearForm();
    this.saveToLocalStorage();
  }

  /** Toggle completion status */
  toggleCompletion(task: Task) {
    task.completed = !task.completed;
    this.saveToLocalStorage();
  }

  /** Delete a task by id */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveToLocalStorage();
  }

  /** Edit a task */
  editTask(task: Task) {
    this.editingTask = task;
    this.taskTitle = task.title;
    this.taskDescription = task.description;
  }

  /** Cancel editing */
  cancelEdit() {
    this.clearForm();
    this.editingTask = null;
  }

  /** Clear input fields */
  clearForm() {
    this.taskTitle = '';
    this.taskDescription = '';
  }

  /** Load tasks from local storage */
  loadTasks() {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
  }

  /** Save tasks to local storage */
  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
