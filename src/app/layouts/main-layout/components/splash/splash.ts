import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [],
  templateUrl: './splash.html',
  styleUrl: './splash.css'
})
export class SplashComponent {
  @Output() entrar = new EventEmitter<void>();
  dispersar = false;
  mouseX = 50;
  mouseY = 50;

  hojas: any[] = [];

  constructor() {
    const colores = [
      { fill: '#6b8d23', vein: '#4a6118' },
      { fill: '#8aab3a', vein: '#6b8d23' },
      { fill: '#a4c44a', vein: '#8aab3a' },
      { fill: '#c9874a', vein: '#a66b34' },
      { fill: '#d4a574', vein: '#b8864e' },
      { fill: '#d4c5a9', vein: '#b8a88a' },
      { fill: '#4a6118', vein: '#344510' },
      { fill: '#7a9b28', vein: '#5c7a1e' },
    ];

    for (let i = 0; i < 150; i++) {
      const color = colores[Math.floor(Math.random() * colores.length)];
      this.hojas.push({
        x: Math.random() * 110 - 5,
        y: Math.random() * 110 - 5,
        baseX: 0,
        baseY: 0,
        size: 50 + Math.random() * 90,
        rotation: Math.random() * 360,
        fill: color.fill,
        vein: color.vein,
        flipX: Math.random() > 0.5 ? -1 : 1,
        disperseX: (Math.random() - 0.5) * 300,
        disperseY: (Math.random() - 0.5) * 300,
        disperseRotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.5,
        reactivity: 0.5 + Math.random() * 2
      });
    }

    this.hojas.forEach(h => {
      h.baseX = h.x;
      h.baseY = h.y;
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.dispersar) return;
    this.mouseX = (event.clientX / window.innerWidth) * 100;
    this.mouseY = (event.clientY / window.innerHeight) * 100;

    this.hojas.forEach(h => {
      const dx = h.baseX - this.mouseX;
      const dy = h.baseY - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 25) {
        const push = (25 - dist) * 0.15 * h.reactivity;
        h.x = h.baseX + (dx / dist) * push;
        h.y = h.baseY + (dy / dist) * push;
      } else {
        h.x = h.baseX;
        h.y = h.baseY;
      }
    });
  }

  onClick() {
    this.dispersar = true;
    setTimeout(() => {
      this.entrar.emit();
    }, 2500);
  }
}
