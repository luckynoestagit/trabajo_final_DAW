import { Injectable } from '@angular/core';
import { Producto } from './producto.service';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoLocalService {
  private items: ItemCarrito[] = [];
  private STORAGE_KEY = 'temporada_carrito';

  constructor() {
    this.cargarDesdeStorage();
  }

  private cargarDesdeStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        this.items = JSON.parse(data);
      } catch {
        this.items = [];
      }
    }
  }

  private guardarEnStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
  }

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
    this.guardarEnStorage();
  }

  quitar(productoId: number) {
    this.items = this.items.filter(i => i.producto.id !== productoId);
    this.guardarEnStorage();
  }

  cambiarCantidad(productoId: number, cantidad: number) {
    const item = this.items.find(i => i.producto.id === productoId);
    if (item) {
      if (cantidad <= 0) {
        this.quitar(productoId);
      } else {
        item.cantidad = cantidad;
        this.guardarEnStorage();
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
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
