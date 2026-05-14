import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MensajeService {
  private URL = environment.apiURL;
  constructor(private http: HttpClient) {}

  enviarMensaje(datos: any): Observable<any> {
    return this.http.post(`${this.URL}/mensajes/`, datos);
  }
}
