import {Component, model} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

type DatosDeEnvio = { email: string, password: string };

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formLogin: FormGroup;
  onToggleRegister = model(undefined);

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.formBuilder.group({
      "email": ["", [Validators.required, Validators.email, Validators.minLength(5)]],
      "password": ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  iniciarSesion() {
    if (this.formLogin.invalid) {
      alert("Formulario no válido");
      return;
    }

    const datosParaEnviar: DatosDeEnvio = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    };

    this.authService.login(datosParaEnviar).subscribe({
      next: (response) => {
        localStorage.setItem("temporada_token", response.data.token);
        localStorage.setItem("temporada_refresh_token", response.data.refreshToken);

        const datos: any = {
          email: response.data.email,
          nombre: response.data.nombre,
          telefono: response.data.telefono
        };
        localStorage.setItem("temporada_datos", JSON.stringify(datos));

        alert("Bienvenido " + response.data.nombre);
        this.router.navigate(["/"]);
      },
      error: (err) => {
        console.error(err);
        alert("Error al iniciar sesión");
      }
    });
  }

  onRegisterClick() {
    this.router.navigate(['/register']);
  }
}
