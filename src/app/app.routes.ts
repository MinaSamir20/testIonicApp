import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { WelcomePage } from './pages/welcome/welcome.page';
import { TodoListPage } from './pages/todo-list/todo-list.page';

export const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomePage
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'todo-list',
    component: TodoListPage
  }
];
