import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, AvatarGroupModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userProfile: any = {};

  constructor(private authService: AuthService,
    private router: Router
  )
  {}

  redirect(url:string)
  {
    this.router.navigate(['/'+url]);
  }

  ngOnInit() {
    this.authService.getUser().subscribe(
      (user: any) => {
        this.userProfile = user
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.router.navigate(['/logout']);
      }
    );
  }
}
