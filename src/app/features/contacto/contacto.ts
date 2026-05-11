import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MensajeService } from '../../services/mensaje.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css'
})
export class ContactoComponent {
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
