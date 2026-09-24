import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'timeline' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'timeline',
    loadComponent: () => import('./pages/timeline/timeline.component').then((m) => m.TimelineComponent),
    canActivate: [authGuard],
  },
  {
    path: 'friends',
    loadComponent: () => import('./pages/friends/friends.component').then((m) => m.FriendsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages.component').then((m) => m.MessagesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', redirectTo: 'timeline' },
];
