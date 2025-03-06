import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PrimeIcons } from 'primeng/api';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, AvatarGroupModule,ThemeToggleComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  userProfile: any = {};
  admin: boolean = false;

  constructor(private router: Router,
    public themeService: ThemeService
  )
  {}

  redirect(url:string)
  {
    this.router.navigate(['/'+url]);
  }

  ngOnInit() {
    if(localStorage.getItem('admin') !== null)
      {
        this.admin = true;
      }
    this.userProfile= {
      avatar: localStorage.getItem('avatar'),
      name: localStorage.getItem('username')
    }
  }
}
