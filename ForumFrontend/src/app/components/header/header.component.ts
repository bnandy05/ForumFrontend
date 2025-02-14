import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  username: string = '';

  constructor(private authService: AuthService)
  {}

  ngOnInit() {
    this.authService.getUser().subscribe(
      (user: any) => {
        this.username = user.username;
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.username = "";
      }
    );
  }
}
