import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  scrollLeft() {
    const container = document.querySelector('.product-container') as HTMLElement;
    container.scrollBy({ left: -320, behavior: 'smooth' });
  }
//efecto scroll
  scrollRight() {
    const container = document.querySelector('.product-container') as HTMLElement;
    container.scrollBy({ left: 320, behavior: 'smooth' });
  }
}
