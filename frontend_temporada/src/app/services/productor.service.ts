import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductorService {
  private URL = environment.apiURL;
  constructor(private http: HttpClient) {}

  getProductores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/productores/`);
  }
}
