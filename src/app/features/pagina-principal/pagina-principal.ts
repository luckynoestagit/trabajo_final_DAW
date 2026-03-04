import { Component } from '@angular/core';
import {NewnewsletterSection} from '../../layouts/main-layout/components/newnewsletter-section/newnewsletter-section';
import {Products} from '../../layouts/main-layout/components/products/products';


@Component({
  selector: 'app-pagina-principal',
  imports: [NewnewsletterSection, Products ],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.css',
})
export class PaginaPrincipal {

}
