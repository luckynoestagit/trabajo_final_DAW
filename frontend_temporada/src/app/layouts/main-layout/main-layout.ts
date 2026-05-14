import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { SplashComponent } from './components/splash/splash';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SplashComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  showSplash = true;

  onEntrar() {
    this.showSplash = false;
    const audio = new Audio();
    audio.src = 'assets/audio/musicadefondo.mp3';
    audio.loop = true;
    audio.volume = 0.3;
    audio.play();
  }
}
