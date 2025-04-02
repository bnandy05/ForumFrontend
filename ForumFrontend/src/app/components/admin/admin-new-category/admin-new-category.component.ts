import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './../../header/header.component';
import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-new-category',
  imports: [HeaderComponent, FormsModule, CommonModule],
  templateUrl: './admin-new-category.component.html',
  styleUrl: './admin-new-category.component.css'
})
export class AdminNewCategoryComponent {
  category: string = '';
  categories: any[] = [];

  constructor(private adminService: AdminService){}

  ngOnInit() {
    this.getCategories();
  }

  submit() {
    if (!this.category.trim()) {
      return;
    }

    this.adminService.uploadCategory(this.category).subscribe(() => {
      this.category = '';
      this.getCategories();
    });
  }

  getCategories() {
    this.adminService.getCategories().subscribe(response => {
      this.categories = response.categories;
    });
  }

  deleteCategory(id: number) {
    this.adminService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(cat => cat.id !== id);
    });
  }
}
