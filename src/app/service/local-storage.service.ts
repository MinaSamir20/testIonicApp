import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storageKey = 'task';
  constructor() { }

  getTasks(): string[] {
    const tasks = localStorage.getItem(this.storageKey);
    return tasks ? JSON.parse(tasks) : [];
  }

  saveTasks(tasks: string[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}
