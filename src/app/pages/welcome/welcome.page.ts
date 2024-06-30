import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import * as icons from 'ionicons/icons';
import { LocalStorageService } from '../../service/local-storage.service';
import { TaskService } from '../../service/task.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonList,
  IonButton,
  IonCol,
  IonRow,
  IonIcon,
  IonImg,
  IonGrid,
} from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonicModule],
  providers: [LocalStorageService, TaskService],
})
export class WelcomePage implements OnInit {
  title = 'Todo List';
  img = '../../assets/icon/icon.png'; // Update with your image path
  newtask: string = '';
  tasks: any[] = [];
  private localStorageKey = 'task';
  constructor(
    private localStorageService: LocalStorageService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: Event) {
    this.syncTasks();
  }

  loadTasks() {
    if (navigator.onLine) {
      this.taskService.getTasks().subscribe((tasks) => {
        this.tasks = tasks;
        localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
      });
    } else {
      this.tasks = JSON.parse(
        localStorage.getItem(this.localStorageKey) || '[]'
      );
    }
  }

  addTask() {
    if (this.newtask.trim().length > 0) {
      if (navigator.onLine) {
        this.taskService.addTask(this.newtask).subscribe((response) => {
          // this.tasks = response.task;
          this.tasks.push(response);
          localStorage.setItem(
            this.localStorageKey,
            JSON.stringify(this.tasks)
          );
          this.newtask = '';
        });
      } else {
        this.tasks.push({ task: this.newtask });
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
        this.newtask = '';
      }
    }
  }

  editTask(index: number, newtask: string) {
    if (newtask.trim().length > 0) {
      if (navigator.onLine) {
        this.taskService.updateTask(index, newtask).subscribe((response) => {
          this.tasks = response.task;
          localStorage.setItem(
            this.localStorageKey,
            JSON.stringify(this.tasks)
          );
        });
      } else {
        this.tasks[index].description = newtask;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
      }
    }
  }

  deleteTask(index: number) {
    if (navigator.onLine) {
      this.taskService.deleteTask(index).subscribe((response) => {
        this.tasks = response.task;
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
      });
    } else {
      this.tasks.splice(index, 1);
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
    }
  }

  private syncTasks() {
    const offlineTasks = JSON.parse(
      localStorage.getItem(this.localStorageKey) || '[]'
    );
    if (offlineTasks.length > 0) {
      this.taskService.syncTasks(offlineTasks).subscribe((responses) => {
        this.taskService.getTasks().subscribe((tasks) => {
          this.tasks = tasks;
          localStorage.setItem(
            this.localStorageKey,
            JSON.stringify(this.tasks)
          );
        });
      });
    }
  }
}
