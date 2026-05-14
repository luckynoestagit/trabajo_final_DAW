import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private URL = environment.apiURL;
  constructor(private http: HttpClient) {}

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/eventos/`);
  }

  inscribirse(eventoId: number, datos: any): Observable<any> {
    return this.http.post(`${this.URL}/eventos/${eventoId}/inscribirse/`, datos);
  }
}
