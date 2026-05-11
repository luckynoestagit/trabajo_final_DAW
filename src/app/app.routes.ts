import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

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
      },
      {
        path: 'carta',
        loadComponent: () => import('./features/carta/carta').then(c => c.CartaComponent)
      },
      {
        path: 'reservar',
        loadComponent: () => import('./features/reservar/reservar').then(c => c.ReservarComponent)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./features/contacto/contacto').then(c => c.ContactoComponent)
      },
      {
        path: 'cuenta',
        canActivate: [authGuard],
        loadComponent: () => import('./features/cuenta/cuenta').then(c => c.CuentaComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
