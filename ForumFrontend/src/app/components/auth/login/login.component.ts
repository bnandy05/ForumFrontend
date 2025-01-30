import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <form (submit)="login()">
      <input type="email" [(ngModel)]="email" placeholder="Email">
      <input type="password" [(ngModel)]="password" placeholder="Jelszó">
      <button type="submit">Bejelentkezés</button>
    </form>
  `,
  imports: [FormsModule]
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe((response: any) => {
      console.log('Sikeres bejelentkezés:', response);
    });
  }
}