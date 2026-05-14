import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private URL = environment.apiURL;
  constructor(private http: HttpClient) {}

  crearPedido(datos: any): Observable<any> {
    return this.http.post(`${this.URL}/pedidos/`, datos);
  }

  getPedidosPorEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/pedidos/?email=${email}`);
  }
}
