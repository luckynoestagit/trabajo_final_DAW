import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css'
})
export class ReservarComponent implements OnInit {
  step = 1;
  confirmada = false;
  reservaId = '';
  errorMsg = '';
  loading = false; // Nuevo: Para mostrar estado de carga en el botón
  fechaHoy: string = '';

  form: FormGroup;
  horas = ['13:00','13:30','14:00','14:30','15:00','20:00','20:30','21:00','21:30','22:00'];

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['13:00', Validators.required],
      num_personas: [2, [Validators.required, Validators.min(1), Validators.max(50)]],
      sala: ['principal', Validators.required],
      nombre_cliente: ['', Validators.required],
      email_cliente: ['', [Validators.required, Validators.email]],
      telefono_cliente: ['', Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit() {
    this.fechaHoy = new Date().toISOString().split('T')[0];

    // Escuchar cuando el usuario cambia la fecha en el formulario
    this.form.get('fecha')?.valueChanges.subscribe(fechaSeleccionada => {
      if (fechaSeleccionada) {
        const date = new Date(fechaSeleccionada);
        const diaSemana = date.getUTCDay(); // 0 es Domingo, 1 es Lunes...

        if (diaSemana === 1) { // 1 = Lunes
          this.errorMsg = 'Los lunes estamos cerrados. Por favor, elige otro día.';
          this.form.get('fecha')?.setErrors({ 'cerrado': true });
        } else {
          if (this.errorMsg.includes('lunes')) this.errorMsg = '';
        }
      }
    });
  }

  seleccionarHora(hora: string) {
    this.form.patchValue({ hora });
    this.errorMsg = '';
  }

  // CAMBIO CLAVE: Validación contra el servidor antes de pasar al paso 2
  siguiente() {
    if (this.form.get('fecha')?.invalid || this.form.get('hora')?.invalid) {
      this.errorMsg = 'Por favor, selecciona una fecha y hora válidas.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    // Consultamos al nuevo endpoint de Django
    this.reservaService.verificarDisponibilidad(this.form.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.disponible) {
          this.step = 2; // Avanzamos solo si hay sitio
        } else {
          this.errorMsg = res.mensaje; // "Límite superado... prueba terraza"
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'No se pudo verificar la disponibilidad. Inténtalo de nuevo.';
      }
    });
  }

  confirmar() {
    if (this.form.invalid) return;
    this.errorMsg = 'Finalizando tu reserva...';

    this.reservaService.crearReserva(this.form.value).subscribe({
      next: (res) => {
        this.reservaId = 'RV-' + res.data.id;
        this.confirmada = true;
        this.errorMsg = '';
      },
      error: (err) => {
        // Manejo de errores detallado del backend
        const e = err.error;
        if (e && e.mensaje) {
          this.errorMsg = e.mensaje;
        } else if (typeof e === 'object') {
          const firstKey = Object.keys(e)[0];
          this.errorMsg = Array.isArray(e[firstKey]) ? e[firstKey][0] : e[firstKey];
        } else {
          this.errorMsg = 'Error al confirmar. Posiblemente el cupo se llenó hace un instante.';
        }
      }
    });
  }
}
