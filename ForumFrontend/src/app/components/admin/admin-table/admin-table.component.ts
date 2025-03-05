import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-table',
  imports: [HeaderComponent],
  templateUrl: './admin-table.component.html',
  styleUrl: './admin-table.component.css'
})
export class AdminTableComponent {

  constructor(private router: Router) {}

  userClick(userId: number, event: MouseEvent): void {
    this.router.navigate(['/profile', userId]);
  }

}
