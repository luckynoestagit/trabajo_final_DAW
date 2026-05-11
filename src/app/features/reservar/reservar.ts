import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservar.html',
  styleUrl: './reservar.css'
})
export class ReservarComponent {
  step = 1;
  confirmada = false;
  reservaId = '';
  errorMsg = '';

  form: FormGroup;

  horas = ['13:00','13:30','14:00','14:30','15:00','20:00','20:30','21:00','21:30','22:00'];

  constructor(private fb: FormBuilder, private reservaService: ReservaService) {
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['21:00', Validators.required],
      num_personas: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      sala: ['principal', Validators.required],
      nombre_cliente: ['', Validators.required],
      email_cliente: ['', [Validators.required, Validators.email]],
      telefono_cliente: ['', Validators.required],
      observaciones: ['']
    });
  }

  seleccionarHora(hora: string) {
    this.form.patchValue({ hora });
  }

  siguiente() {
    if (this.form.get('fecha')?.valid && this.form.get('hora')?.valid) {
      this.step = 2;
    }
  }

  confirmar() {
    if (this.form.invalid) return;
    this.reservaService.crearReserva(this.form.value).subscribe({
      next: (res) => {
        this.reservaId = 'RV-' + res.data.id;
        this.confirmada = true;
      },
      error: () => { this.errorMsg = 'Error al crear la reserva. Inténtalo de nuevo.'; }
    });
  }
}
