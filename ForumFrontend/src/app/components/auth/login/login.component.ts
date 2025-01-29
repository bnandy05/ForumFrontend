import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

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
  imports: []
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(response => {
      console.log('Sikeres bejelentkezés:', response);
    });
  }
}
