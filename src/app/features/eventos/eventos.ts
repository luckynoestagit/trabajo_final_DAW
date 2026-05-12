import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.html',
  styleUrl: './eventos.css'
})
export class EventosComponent implements OnInit {
  eventos: any[] = [];
  cargando = true;
  eventoAbierto: any = null;
  inscripcionOk = false;
  errorMsg = '';

  formInscripcion = {
    nombre: '',
    email: '',
    telefono: '',
    num_personas: 1
  };

  constructor(private eventoService: EventoService) {
    const datos = localStorage.getItem('temporada_datos');
    if (datos) {
      const user = JSON.parse(datos);
      this.formInscripcion.nombre = user.nombre || '';
      this.formInscripcion.email = user.email || '';
      this.formInscripcion.telefono = user.telefono || '';
    }
  }

  ngOnInit() {
    this.eventoService.getEventos().subscribe({
      next: (data) => {
        this.eventos = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  abrirEvento(evento: any) {
    this.eventoAbierto = evento;
    this.inscripcionOk = false;
    this.errorMsg = '';
  }

  cerrarEvento() {
    this.eventoAbierto = null;
    this.inscripcionOk = false;
    this.errorMsg = '';
  }

  inscribirse() {
    if (!this.formInscripcion.nombre || !this.formInscripcion.email || !this.formInscripcion.telefono) {
      this.errorMsg = 'Rellena todos los campos';
      return;
    }

    this.eventoService.inscribirse(this.eventoAbierto.id, this.formInscripcion).subscribe({
      next: (res) => {
        this.inscripcionOk = true;
        this.eventoAbierto.plazas_disponibles = res.plazas_restantes;
        this.errorMsg = '';
      },
      error: (err) => {
        if (err.error && err.error.error) {
          this.errorMsg = err.error.error;
        } else {
          this.errorMsg = 'Error al inscribirse. Inténtalo de nuevo.';
        }
      }
    });
  }

  getImagenUrl(imagen: string | null): string {
    if (!imagen) return '';
    if (imagen.startsWith('http')) return imagen;
    return `http://127.0.0.1:8000${imagen}`;
  }
}
