import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.getUser().subscribe(
      (user: any) => {
        console.log('Logged-in user:', user);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
}
