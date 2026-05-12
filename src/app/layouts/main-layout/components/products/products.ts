import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService, Producto } from '../../../../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  productos: Producto[] = [];
  cargando = true;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.sort(() => Math.random() - 0.5);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.cargando = false;
      }
    });
  }

  verCarta() {
    this.router.navigate(['/carta']);
  }

  scrollLeft() {
    const container = document.querySelector('.product-container') as HTMLElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    const container = document.querySelector('.product-container') as HTMLElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return 'assets/img/plato-default.png';
    if (imagen.startsWith('http')) return imagen;
    return `http://127.0.0.1:8000${imagen}`;
  }
}
