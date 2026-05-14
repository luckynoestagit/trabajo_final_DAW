import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  temporada: string;
  imagen: string | null;
  disponible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private URL = environment.apiURL;

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.URL}/productos/`);
  }

  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.URL}/productos/?categoria=${categoria}`);
  }
}
