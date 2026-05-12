import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductorService } from '../../services/productor.service';

@Component({
  selector: 'app-productores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productores.html',
  styleUrl: './productores.css'
})
export class ProductoresComponent implements OnInit {
  productores: any[] = [];
  cargando = true;
  productorAbierto: any = null;

  constructor(private productorService: ProductorService) {}

  ngOnInit() {
    this.productorService.getProductores().subscribe({
      next: (data) => {
        this.productores = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  abrirProductor(p: any) {
    this.productorAbierto = p;
  }

  cerrarProductor() {
    this.productorAbierto = null;
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return 'assets/img/plato-default.png';
    if (imagen.startsWith('http')) return imagen;
    return `http://127.0.0.1:8000${imagen}`;
  }
}
