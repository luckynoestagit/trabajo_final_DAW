import {Component, signal} from '@angular/core';
import { RouterLink } from '@angular/router';
import {Menu} from '../menu/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: 'header.html',
  imports: [
    Menu,
    RouterLink,
  ],
  styleUrl: 'header.css'
})
export class HeaderComponent {
  openMenu = signal<boolean>(false);
  cambiarEstadoMenu () {
    this.openMenu.update(state => !state)
  }
}
