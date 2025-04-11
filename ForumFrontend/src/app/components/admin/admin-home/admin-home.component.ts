import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { AdminTableComponent } from '../admin-table/admin-table.component';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule,HeaderComponent, RouterLink],
  animations: [fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),],
  standalone: true,
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  constructor(
    public themeService: ThemeService
  )
  {}
}
