import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoLocalService } from '../../services/carrito-local.service';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class PedidoComponent {
  items: any[] = [];
  total = 0;
  confirmado = false;
  pedidoId = '';
  errorMsg = '';

  datos = {
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    tipo_entrega: 'domicilio',
    direccion_entrega: '',
    metodo_pago: 'paypal',
    observaciones: ''
  };

  constructor(
    private carritoService: CarritoLocalService,
    private pedidoService: PedidoService,
    private router: Router
  ) {
    this.items = this.carritoService.getItems();
    this.total = this.carritoService.getTotal();

    const guardados = localStorage.getItem('temporada_datos');
    if (guardados) {
      const user = JSON.parse(guardados);
      this.datos.nombre_cliente = user.nombre || '';
      this.datos.email_cliente = user.email || '';
      this.datos.telefono_cliente = user.telefono || '';
      this.datos.direccion_entrega = user.direccion || '';
    }
  }

  confirmarPedido() {
    if (!this.datos.nombre_cliente || !this.datos.email_cliente || !this.datos.telefono_cliente) {
      this.errorMsg = 'Rellena todos los campos obligatorios';
      return;
    }
    if (this.datos.tipo_entrega === 'domicilio' && !this.datos.direccion_entrega) {
      this.errorMsg = 'La dirección es obligatoria para envío a domicilio';
      return;
    }
    if (this.items.length === 0) {
      this.errorMsg = 'Tu carrito está vacío';
      return;
    }

    const pedidoData = {
      ...this.datos,
      total: this.total,
      lineas_data: this.items.map(i => ({
        producto_id: i.producto.id,
        cantidad: i.cantidad
      }))
    };

    this.pedidoService.crearPedido(pedidoData).subscribe({
      next: (res) => {
        this.pedidoId = '#TM-' + res.data.id;
        this.confirmado = true;
        this.carritoService.vaciar();
      },
      error: () => {
        this.errorMsg = 'Error al crear el pedido. Inténtalo de nuevo.';
      }
    });
  }

  volverACarta() {
    this.router.navigate(['/carta']);
  }

  irACuenta() {
    this.router.navigate(['/cuenta']);
  }
}
