import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import {NewnewsletterSection} from './components/newnewsletter-section/newnewsletter-section';
import {Products} from './components/products/products';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NewnewsletterSection,  Products],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})

export class MainLayout {}
