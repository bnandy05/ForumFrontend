import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';


@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, FileUploadModule, AvatarGroupModule, AvatarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userProfile: any = {};
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  loadUserProfile(): void {
    this.authService.getUser().subscribe({
      next: (profile) => {
        console.log(profile)
        this.userProfile = profile;
      },
      error: (err) => {
        console.error('Hiba történt a profil betöltésekor', err);
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadAvatar(): void {
    if (this.selectedFile) {
      this.authService.uploadAvatar(this.selectedFile);
      this.loadUserProfile();
    }
  }

  deleteAvatar(): void {
      this.authService.deleteAvatar();
      this.loadUserProfile();
  }
}
