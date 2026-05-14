import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Menu } from '../menu/menu';
import { CarritoLocalService } from '../../../../services/carrito-local.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: 'header.html',
  imports: [Menu, RouterLink, FormsModule],
  styleUrl: 'header.css'
})
export class HeaderComponent {
  openMenu = signal<boolean>(false);
  buscadorAbierto = signal<boolean>(false);
  musicaPlaying = false;
  terminoBusqueda = '';
  audio: HTMLAudioElement;

  constructor(
    private carritoService: CarritoLocalService,
    private router: Router
  ) {
    this.audio = new Audio();
    this.audio.src = 'assets/audio/musicadefondo.mp3';
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  cambiarEstadoMenu() {
    this.openMenu.update(state => !state);
  }

  cantidadCarrito(): number {
    return this.carritoService.getCantidadTotal();
  }

  toggleMusica() {
    if (this.musicaPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.musicaPlaying = !this.musicaPlaying;
  }

  toggleBuscar() {
    this.buscadorAbierto.update(state => !state);
    this.terminoBusqueda = '';
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.buscadorAbierto.set(false);
      this.router.navigate(['/carta'], { queryParams: { buscar: this.terminoBusqueda.trim() } });
    }
  }
}
