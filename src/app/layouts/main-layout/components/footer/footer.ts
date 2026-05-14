import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  emailSuscripcion = '';
  mensajeSuscripcion = '';
  suscrito = false;

  constructor(private http: HttpClient) {}

  suscribir() {
    if (!this.emailSuscripcion || !this.emailSuscripcion.includes('@')) {
      this.mensajeSuscripcion = 'Introduce un email válido';
      return;
    }
    this.http.post<any>(`${environment.apiURL}/suscribir/`, { email: this.emailSuscripcion }).subscribe({
      next: (res) => {
        this.mensajeSuscripcion = res.message;
        this.suscrito = true;
      },
      error: () => {
        this.mensajeSuscripcion = 'Error al suscribirse';
      }
    });
  }
}
