import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(c => c.AuthLayout)
  },
  {
    path: 'register',
    loadComponent: () => import('./layouts/auth-layout/auth-layout').then(c => c.AuthLayout)
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(c => c.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/pagina-principal/pagina-principal').then(c => c.PaginaPrincipal)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
