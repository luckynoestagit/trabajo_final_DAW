import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../features/auth/login/login';
import { Register } from '../../features/auth/register/register';
import { NgClass } from '@angular/common';

type typePage = "login" | "register";

@Component({
  selector: 'app-auth-layout',
  imports: [
    Login,
    Register,
    NgClass
  ],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout implements OnInit {

  typePageForm: typePage = "login";

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url.includes('register')) {
      this.typePageForm = 'register';
    } else {
      this.typePageForm = 'login';
    }
  }

  togglePageForm(type: typePage) {
    this.typePageForm = type;
    this.router.navigate([`/${type}`]);
  }

}
