import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';

interface User {
  id: number;
  name: string;
  email: string;
  is_banned: number;
  is_admin: number;
}

interface UsersResponse {
  data: User[];
  current_page: number;
  last_page: number;
}

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  styleUrls: ['./admin-table.component.css']
})
export class AdminTableComponent implements OnInit {
  users: UsersResponse = {
    data: [],
    current_page: 0,
    last_page: 0
  };
  currentUserId = Number(localStorage.getItem('id'));
  loading = false;
  allLoaded = false;

  constructor(
    private router: Router, 
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadMore();
  }

  userClick(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  makeAdmin(userId: number): void {
    this.adminService.makeAdmin(userId).subscribe({
      next: () => this.refreshCurrentPage()
    });
  }

  revokeAdmin(userId: number): void {
    this.adminService.revokeAdmin(userId).subscribe({
      next: () => this.refreshCurrentPage()
    });
  }

  banUser(userId: number): void {
    this.adminService.banUser(userId).subscribe({
      next: () => this.refreshCurrentPage()
    });
  }

  unbanUser(userId: number): void {
    this.adminService.unbanUser(userId).subscribe({
      next: () => this.refreshCurrentPage()
    });
  }

  refreshCurrentPage(): void {
    if (this.loading) return;

    this.loading = true;
    this.adminService.getUsers(this.users.current_page).subscribe({
      next: (response) => {
        this.users.data = response.users.data;
        
        this.users.current_page = response.users.current_page;
        this.users.last_page = response.users.last_page;

        this.loading = false;
      },
      error: (err) => {
        console.error('Felhasználók frissítése sikertelen:', err);
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.loading || this.allLoaded) return;

    this.loading = true;
    const nextPage = this.users.current_page + 1;

    this.adminService.getUsers(nextPage).subscribe({
      next: (response) => {
        this.users.data = [
          ...this.users.data, 
          ...response.users.data
        ];

        this.users.current_page = response.users.current_page;
        this.users.last_page = response.users.last_page;

        if (this.users.current_page >= this.users.last_page) {
          this.allLoaded = true;
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Felhasználók betöltése sikertelen:', err);
        this.loading = false;
      }
    });
  }
}