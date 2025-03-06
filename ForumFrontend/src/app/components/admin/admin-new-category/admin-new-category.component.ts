import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './../../header/header.component';
import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-new-category',
  imports: [HeaderComponent, FormsModule],
  templateUrl: './admin-new-category.component.html',
  styleUrl: './admin-new-category.component.css'
})
export class AdminNewCategoryComponent {
  category: string = "";

  constructor(private adminService: AdminService){}

  submit() :void
  {
    if(this.category!="")
    {
      this.adminService.uploadCategory(this.category).subscribe();
    }
  }
}
