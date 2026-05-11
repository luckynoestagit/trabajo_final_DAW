import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { ReservaService } from '../../services/reserva.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.css'
})
export class CuentaComponent implements OnInit {
  tab = 'pedidos';
  pedidos: any[] = [];
  reservas: any[] = [];
  datosUsuario: any = {};
  editando = false;
  mensaje = '';

  constructor(
    private router: Router,
    private pedidoService: PedidoService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const datos = localStorage.getItem('temporada_datos');
    if (datos) this.datosUsuario = JSON.parse(datos);

    if (this.datosUsuario.email) {
      this.pedidoService.getPedidosPorEmail(this.datosUsuario.email).subscribe({
        next: (data) => { this.pedidos = data; },
        error: () => {}
      });

      this.http.get<any[]>(`${environment.apiURL}/reservas/?email=${this.datosUsuario.email}`).subscribe({
        next: (data) => { this.reservas = data; },
        error: () => {}
      });
    }
  }

  guardarDatos() {
    localStorage.setItem('temporada_datos', JSON.stringify(this.datosUsuario));
    this.editando = false;
    this.mensaje = 'Datos actualizados correctamente';
    setTimeout(() => this.mensaje = '', 3000);
  }

  cerrarSesion() {
    localStorage.removeItem('temporada_token');
    localStorage.removeItem('temporada_refresh_token');
    localStorage.removeItem('temporada_datos');
    this.router.navigate(['/login']);
  }
}
