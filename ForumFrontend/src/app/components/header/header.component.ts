import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  username: string = '';

  constructor(private authService: AuthService,
    private router: Router
  )
  {}

  ngOnInit() {
    this.authService.getUser().subscribe(
      (user: any) => {
        this.username = user.name;
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.username = "";
        this.router.navigate(['/logout']);
      }
    );
  }
}
