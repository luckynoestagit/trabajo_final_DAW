import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      edad: ['', [Validators.required, Validators.min(18)]],
      telefono: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage = '';
      this.authService.registro(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const errores = err.error;

          if (errores && errores.non_field_errors) {
            this.errorMessage = errores.non_field_errors[0];
            return;
          }

          if (errores && typeof errores === 'object') {
            const mensajes: string[] = [];
            Object.keys(errores).forEach(campo => {
              const valor = errores[campo];
              const msg = Array.isArray(valor) ? valor[0] : valor;
              mensajes.push(msg);
            });
            if (mensajes.length > 0) {
              this.errorMessage = mensajes.join(' | ');
              return;
            }
          }

          this.errorMessage = 'Error al registrarse, revisa los datos';
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
