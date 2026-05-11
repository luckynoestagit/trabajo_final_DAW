import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoLocalService, ItemCarrito } from '../../services/carrito-local.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent {
  items: ItemCarrito[] = [];
  total = 0;

  constructor(
    private carritoService: CarritoLocalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.actualizar();
  }

  actualizar() {
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();
  }

  sumar(id: number) {
    const item = this.items.find(i => i.producto.id === id);
    if (item) {
      this.carritoService.cambiarCantidad(id, item.cantidad + 1);
      this.actualizar();
    }
  }

  restar(id: number) {
    const item = this.items.find(i => i.producto.id === id);
    if (item) {
      this.carritoService.cambiarCantidad(id, item.cantidad - 1);
      this.actualizar();
    }
  }

  eliminar(id: number) {
    this.carritoService.quitar(id);
    this.actualizar();
  }

  irACarta() {
    this.router.navigate(['/carta']);
  }

  irACheckout() {
    this.router.navigate(['/cuenta']);
  }
}
