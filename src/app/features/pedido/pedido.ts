import { Component, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoLocalService } from '../../services/carrito-local.service';
import { PedidoService } from '../../services/pedido.service';

declare let paypal: any;

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css'
})
export class PedidoComponent implements AfterViewChecked {
  items: any[] = [];
  total = 0;
  confirmado = false;
  pedidoId = '';
  errorMsg = '';
  paypalRendered = false;
  paypalVisible = false;

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

  ngAfterViewChecked() {
    if (this.paypalVisible && !this.paypalRendered && this.datos.metodo_pago === 'paypal') {
      const container = document.getElementById('paypal-button-container');
      if (container && container.childElementCount === 0) {
        this.paypalRendered = true;
        this.renderPaypal();
      }
    }
  }

  validarDatos(): boolean {
    if (!this.datos.nombre_cliente || !this.datos.email_cliente || !this.datos.telefono_cliente) {
      this.errorMsg = 'Rellena todos los campos obligatorios';
      return false;
    }
    if (this.datos.tipo_entrega === 'domicilio' && !this.datos.direccion_entrega) {
      this.errorMsg = 'La dirección es obligatoria para envío a domicilio';
      return false;
    }
    if (this.items.length === 0) {
      this.errorMsg = 'Tu carrito está vacío';
      return false;
    }
    this.errorMsg = '';
    return true;
  }

  mostrarPaypal() {
    if (!this.validarDatos()) return;
    this.paypalVisible = true;
    this.paypalRendered = false;
  }

  renderPaypal() {
    const total = this.total.toFixed(2);
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'pill',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: 'Pedido Temporada Restaurante',
            amount: {
              currency_code: 'EUR',
              value: total
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.crearPedidoBackend('pagado');
        });
      },
      onError: (err: any) => {
        this.errorMsg = 'Error en el pago con PayPal. Inténtalo de nuevo.';
        console.error('PayPal error:', err);
      },
      onCancel: () => {
        this.errorMsg = 'Pago cancelado.';
      }
    }).render('#paypal-button-container');
  }

  confirmarTarjeta() {
    if (!this.validarDatos()) return;
    this.crearPedidoBackend('pagado');
  }

  crearPedidoBackend(estado: string) {
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
