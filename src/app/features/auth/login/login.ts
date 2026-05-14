import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formLogin: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  iniciarSesion() {
    if (this.formLogin.invalid) {
      Object.keys(this.formLogin.controls).forEach(key => {
        this.formLogin.get(key)?.markAsTouched();
      });
      return;
    }

    this.authService.login(this.formLogin.value).subscribe({
      next: (response) => {
        localStorage.setItem('temporada_token', response.data.token);
        localStorage.setItem('temporada_refresh_token', response.data.refreshToken);localStorage.setItem('temporada_datos', JSON.stringify({
          email: response.data.email,
          nombre: response.data.nombre,
          telefono: response.data.telefono,
          direccion: response.data.direccion || ''
        }));
        this.router.navigate(['/cuenta']);
      },
      error: (err) => {
        const errores = err.error;
        if (errores && errores.non_field_errors) {
          this.errorMessage = errores.non_field_errors[0];
        } else if (errores && typeof errores === 'object') {
          const campos = Object.keys(errores);
          if (campos.length > 0) {
            const msg = errores[campos[0]];
            this.errorMessage = Array.isArray(msg) ? msg[0] : msg;
          } else {
            this.errorMessage = 'Email o contraseña incorrectos';
          }
        } else {
          this.errorMessage = 'Email o contraseña incorrectos';
        }
      }
    });
  }

  onRegisterClick() {
    this.router.navigate(['/register']);
  }
}
