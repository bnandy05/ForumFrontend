import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/theme.service';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-theme-toggle',
  imports: [CommonModule,ButtonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
