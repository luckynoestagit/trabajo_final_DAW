import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Menu } from '../menu/menu';
import { CarritoLocalService } from '../../../../services/carrito-local.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: 'header.html',
  imports: [Menu, RouterLink],
  styleUrl: 'header.css'
})
export class HeaderComponent {
  openMenu = signal<boolean>(false);

  constructor(private carritoService: CarritoLocalService) {}

  cambiarEstadoMenu() {
    this.openMenu.update(state => !state);
  }

  cantidadCarrito(): number {
    return this.carritoService.getCantidadTotal();
  }
}
