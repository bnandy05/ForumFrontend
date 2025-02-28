import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, DialogModule, ImageCropperComponent, AvatarGroupModule, AvatarModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  userId: number | null = null;
  ownProfile: boolean = false;
  currentUserId = Number(localStorage.getItem('id'));

  imageChangedEvent: any = null;
  croppedFile: File | null = null;
  cropperDialogVisible = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? parseInt(idParam, 10) : null;
    });

    if (this.userId != null && this.userId != this.currentUserId) {
      this.loadOtherUserProfile(this.userId);
    } else {
      this.loadUserProfile();
    }
  }

  onFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imageChangedEvent = event;
      this.cropperDialogVisible = true;
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedFile = new File([event.blob], "avatar.png", { type: "image/png" });
    }
  }

  confirmCrop(): void {
    this.cropperDialogVisible = false;
  }

  loadUserProfile(): void {
    this.authService.getUser().subscribe({
      next: (profile) => {
        console.log(profile);
        this.userProfile = profile;
        console.log(this.userProfile)
        this.ownProfile = true;
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a profil betöltése során.' });
      }
    });
  }

  loadOtherUserProfile(userId: number): void {
    this.authService.getOtherUser(userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.ownProfile = false;
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Hiba történt a profil betöltése során.' });
      }
    });
  }

  uploadAvatar(): void {
    if (this.croppedFile) {
      this.authService.uploadAvatar(this.croppedFile);
      this.loadUserProfile();
    }
  }

  deleteAvatar(): void {
    this.authService.deleteAvatar();
    this.loadUserProfile();
  }

  passwordChange(): void {
    this.router.navigate(['/password/change']);
  }

  logout(): void {
    this.router.navigate(['/logout']);
  }

  topics(): void {
    this.router.navigate(['topics/user', this.userProfile.id]);
  }
}
