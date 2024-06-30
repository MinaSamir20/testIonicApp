import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/todos';
  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addTask(task: string): Observable<any> {
    return this.http.post(this.apiUrl, { task });
  }

  updateTask(index: number, task: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${index}`, { task });
  }

  deleteTask(index: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${index}`);
  }

  syncTasks(tasks: any[]): Observable<any[]> {
    const requests = tasks.map(task => this.addTask(task.task));
    return from(Promise.all(requests)).pipe(
      catchError(error => {
        console.error('Sync failed', error);
        return [];
      })
    );
  }
}
