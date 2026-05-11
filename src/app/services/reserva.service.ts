import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private URL = environment.apiURL;
  constructor(private http: HttpClient) {}

  crearReserva(datos: any): Observable<any> {
    return this.http.post(`${this.URL}/reservas/`, datos);
  }
}
