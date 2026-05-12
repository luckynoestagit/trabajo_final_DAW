import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MensajeService } from '../../services/mensaje.service';

declare let L: any;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent implements AfterViewInit {
  enviado = false;
  errorMsg = '';
  form: FormGroup;

  constructor(private fb: FormBuilder, private mensajeService: MensajeService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngAfterViewInit() {
    const map = L.map('mapa').setView([41.3818, 2.1685], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([41.3818, 2.1685])
      .addTo(map)
      .bindPopup('<strong>Temporada</strong><br>C/ Major 42, Barcelona')
      .openPopup();
  }

  enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.mensajeService.enviarMensaje(this.form.value).subscribe({
      next: () => { this.enviado = true; },
      error: () => { this.errorMsg = 'Error al enviar. Inténtalo de nuevo.'; }
    });
  }
}
