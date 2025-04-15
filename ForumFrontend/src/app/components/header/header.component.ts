import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { PrimeIcons } from 'primeng/api';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, AvatarGroupModule,ThemeToggleComponent, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit{
  userProfile: any = {};
  admin: boolean = false;

  constructor(
    public themeService: ThemeService
  )
  {}

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
