import { Component, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  openMenuDesdeHeader = output();

  constructor(private router: Router) {}

  navegar(ruta: string, filtro?: string) {
    this.openMenuDesdeHeader.emit();
    if (filtro) {
      this.router.navigate([ruta], { queryParams: { cat: filtro } });
    } else {
      this.router.navigate([ruta]);
    }
  }
}
