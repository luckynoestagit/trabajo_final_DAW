import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css'
})
export class CuentaComponent implements OnInit {
  tab = 'pedidos';
  pedidos: any[] = [];
  datosUsuario: any = {};

  constructor(private router: Router, private pedidoService: PedidoService) {}

  ngOnInit() {
    const datos = localStorage.getItem('temporada_datos');
    if (datos) this.datosUsuario = JSON.parse(datos);

    if (this.datosUsuario.email) {
      this.pedidoService.getPedidosPorEmail(this.datosUsuario.email).subscribe({
        next: (data) => { this.pedidos = data; },
        error: () => {}
      });
    }
  }

  cerrarSesion() {
    localStorage.removeItem('temporada_token');
    localStorage.removeItem('temporada_refresh_token');
    localStorage.removeItem('temporada_datos');
    this.router.navigate(['/login']);
  }
}
