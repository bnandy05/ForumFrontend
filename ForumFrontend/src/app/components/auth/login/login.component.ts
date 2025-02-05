import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.getCsrfToken().subscribe(() => {
      this.authService.login(this.email, this.password).subscribe((response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      });
    });
  }
}
