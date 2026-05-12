import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NewnewsletterSection } from '../../layouts/main-layout/components/newnewsletter-section/newnewsletter-section';
import { Products } from '../../layouts/main-layout/components/products/products';

@Component({
  selector: 'app-pagina-principal',
  standalone: true,
  imports: [NewnewsletterSection, Products],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css',
})
export class PaginaPrincipal {
  constructor(private router: Router) {}

  irAReservar(sala: string) {
    this.router.navigate(['/reservar'], { queryParams: { sala: sala } });
  }
}
