import { Injectable } from '@angular/core';
import { Producto } from './producto.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoLocalService {
  private items: ItemCarrito[] = [];

  getItems(): ItemCarrito[] {
    return this.items;
  }

  agregar(producto: Producto) {
    const existe = this.items.find(i => i.producto.id === producto.id);
    if (existe) {
      existe.cantidad++;
    } else {
      this.items.push({ producto, cantidad: 1 });
    }
  }

  quitar(productoId: number) {
    this.items = this.items.filter(i => i.producto.id !== productoId);
  }

  cambiarCantidad(productoId: number, cantidad: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) {
      if (cantidad <= 0) {
        this.quitar(productoId);
      } else {
        item.cantidad = cantidad;
      }
    }
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + (parseFloat(i.producto.precio) * i.cantidad), 0);
  }

  getCantidadTotal(): number {
    return this.items.reduce((sum, i) => sum + i.cantidad, 0);
  }

  vaciar() {
    this.items = [];
  }
}
