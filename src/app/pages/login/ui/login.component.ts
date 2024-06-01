// Import necessary Angular Material modules
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../shared/data-access/auth.service'; // Adjust path as necessary
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    this.authService.isLoggedIn().subscribe(res=>{
      console.log(res)
      if(res) {
        this.router.navigate(['/user-profile']);
      }
    })
  }

  googleLogin() {
    this.authService.googleLogin();
  }
}