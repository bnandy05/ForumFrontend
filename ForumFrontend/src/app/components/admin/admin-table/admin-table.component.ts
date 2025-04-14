import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

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
  imports: [CommonModule, HeaderComponent, FormsModule],
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
  category: string | null = "";
  bannedFilter: number | null = null;
  adminFilter: number | null = null;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadMore();
  }

  filterTopics(): void {
    this.allLoaded = false;
    this.users.data = [];
    this.users.current_page = 0;
  
    if (this.category === '') {
      this.category = null;
    }
  
    this.loadMore(this.category, this.bannedFilter, this.adminFilter);
  }

  userClick(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

  makeAdmin(userId: number, name: string): void {
    this.confirmationService.confirm({
      message: 'Biztosan adminná szeretnéd tenni a felhasználót? ('+name+')',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.makeAdmin(userId).subscribe({
          next: () => {
            this.updateUserInPlace(userId);
            localStorage.setItem("refresh","1");
          }
        });
      },
      reject: () => {
      }
    });
  }

  revokeAdmin(userId: number, name: string): void {
    this.confirmationService.confirm({
      message: 'Biztosan el szeretnéd venni a felhasználótól az admin jogokat? ('+name+')',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.revokeAdmin(userId).subscribe({
          next: () => {
            this.updateUserInPlace(userId);
            localStorage.setItem("refresh","1");
          }
        });
      },
      reject: () => {
      }
    });
  }

  banUser(userId: number, name: string): void {
    this.confirmationService.confirm({
      message: 'Biztosan ki szeretnéd tiltani a felhasználót? ('+name+')',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.banUser(userId).subscribe({
          next: () => {
            this.updateUserInPlace(userId);
            localStorage.setItem("refresh","1");
          }
        });
      },
      reject: () => {
      }
    });
  }

  unbanUser(userId: number, name: string): void {
    this.confirmationService.confirm({
      message: 'Biztosan fel szeretnéd oldani a felhasználó kitiltását? ('+name+')',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.unbanUser(userId).subscribe({
          next: () => {
            this.updateUserInPlace(userId);
            localStorage.setItem("refresh","1");
          }
        });
      },
      reject: () => {
      }
    });
  }

  deleteUser(userId: number, name: string): void {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd a felhasználó fiókját? Ez a művelet visszavonhatatlan! ('+name+')',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Törlés',
      rejectLabel: 'Mégse',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            this.removeUserFromList(userId);
            localStorage.setItem("refresh","1");
          }
        });
      },
      reject: () => {
      }
    });
  }

  removeUserFromList(userId: number): void {
    const index = this.users.data.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.users.data.splice(index, 1);
      this.users.data = [...this.users.data];
    }
  }

  updateUserInPlace(userId: number): void {
    if (this.loading) return;

    this.loading = true;
    
    this.adminService.getUser(userId).subscribe({
      next: (updatedUser) => {
        if (!updatedUser) {
          console.error('Felhasználó nem található');
          this.loading = false;
          return;
        }
        
        const index = this.users.data.findIndex(user => user.id === userId);
        if (index !== -1) {
          this.users.data[index] = updatedUser.user;
          this.users.data = [...this.users.data];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Felhasználó frissítése sikertelen:', err);
        this.loading = false;
      }
    });
  }

  refreshCurrentPage(): void {
    if (this.loading) return;

    this.loading = true;
    this.adminService.getUsers(this.users.current_page, this.category, this.bannedFilter, this.adminFilter).subscribe({
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

  loadMore(name: string | null = null, banned: number | null = null, admin: number | null = null): void {
    if(this.loading)
    {
      return;
    }
  
    this.loading = true;
    const nextPage = this.users.current_page + 1;
  
    this.adminService.getUsers(nextPage, name, banned, admin).subscribe({
      next: (response) => {
        if (!response || !response.users || !Array.isArray(response.users.data)) {
          console.error('Hibás API válasz:', response);
          this.loading = false;
          return;
        }

        if (response.users.data.length === 0) {
          this.allLoaded = true;
        }

        if (response.users.data.length > 0) {
          this.users.data = [...this.users.data, ...response.users.data];
          this.users.current_page = response.users.current_page;
          this.users.last_page = response.users.last_page;
        }

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