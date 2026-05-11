import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../services/producto.service';

@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carta.html',
  styleUrl: './carta.css'
})
export class CartaComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriaActiva = 'todos';
  cargando = true;

  categorias = [
    { id: 'todos', label: 'Todo' },
    { id: 'entrante', label: 'Para Empezar' },
    { id: 'principal', label: 'Principales' },
    { id: 'postre', label: 'Postres' },
    { id: 'bebida', label: 'Bebidas' },
  ];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productosFiltrados = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  filtrar(categoria: string) {
    this.categoriaActiva = categoria;
    this.productosFiltrados = categoria === 'todos'
      ? this.productos
      : this.productos.filter(p => p.categoria === categoria);
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return 'assets/img/plato-default.png';
    if (imagen.startsWith('http')) return imagen;
    return `http://127.0.0.1:8000${imagen}`;
  }
}
