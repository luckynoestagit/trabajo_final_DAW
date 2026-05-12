import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CarritoLocalService } from '../../services/carrito-local.service';

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
  mensajeAdd = '';
  terminoBusqueda = '';

  categorias = [
    { id: 'todos', label: 'Todo' },
    { id: 'entrante', label: 'Para Empezar' },
    { id: 'principal', label: 'Principales' },
    { id: 'postre', label: 'Postres' },
    { id: 'bebida', label: 'Bebidas' },
  ];

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private carritoService: CarritoLocalService
  ) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.route.queryParams.subscribe(params => {
          const cat = params['cat'] || 'todos';
          const buscar = params['buscar'] || '';
          if (buscar) {
            this.productosFiltrados = this.productos.filter(p =>
              p.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
              p.descripcion.toLowerCase().includes(buscar.toLowerCase()) ||
              p.categoria.toLowerCase().includes(buscar.toLowerCase())
            );
            this.categoriaActiva = 'todos';
            this.terminoBusqueda = buscar;
          } else {
            this.filtrar(cat);
          }
        });
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  filtrar(categoria: string) {
    this.categoriaActiva = categoria;
    this.terminoBusqueda = '';
    this.productosFiltrados = categoria === 'todos'
      ? this.productos
      : this.productos.filter(p => p.categoria === categoria);
  }

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregar(producto);
    this.mensajeAdd = `${producto.nombre} añadido al carrito`;
    setTimeout(() => this.mensajeAdd = '', 2000);
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.productosFiltrados = this.productos;
    this.categoriaActiva = 'todos';
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return 'assets/img/plato-default.png';
    if (imagen.startsWith('http')) return imagen;
    return `http://127.0.0.1:8000${imagen}`;
  }
}
