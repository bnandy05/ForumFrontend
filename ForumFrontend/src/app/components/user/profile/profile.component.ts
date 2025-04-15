import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { AdminService } from '../../../services/admin.service';

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
  croppedImageUrl: string | null = null;

  imageChangedEvent: any = null;
  croppedFile: File | null = null;
  cropperDialogVisible = false;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? parseInt(idParam, 10) : null;
  
      if (this.userId !== null && this.userId !== this.currentUserId) {
        this.loadOtherUserProfile(this.userId);
      } else {
        this.loadUserProfile();
      }
    });
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
    if (this.croppedFile) {
      this.croppedImageUrl = URL.createObjectURL(this.croppedFile);
    }
    this.cropperDialogVisible = false;
  }

  loadUserProfile(): void {
    this.authService.getUser().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.ownProfile = true;
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: err.error.message });
      }
    });
  }

  loadOtherUserProfile(userId: number): void {
    this.authService.getOtherUser(userId).subscribe({
      next: (profile) => {
        console.log(profile);
        this.userProfile = profile;
        this.ownProfile = false;
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Hiba', detail: err.error.message });
      }
    });
  }

  uploadAvatar(): void {
    if (this.croppedFile) {
      this.authService.uploadAvatar(this.croppedFile);
      this.croppedFile = null;
      this.loadUserProfile();
      this.croppedImageUrl = null;
    }
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

  IsAdmin():boolean
  {
    return this.adminService.isAdmin();
  }

  BanUser(userId:number)
  {
    this.confirmationService.confirm({
      message: 'Biztosan ki szeretnéd tiltani a felhasználót?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.banUser(userId).subscribe();
      },
      reject: () => {
      }
    });
  }

  UnbanUser(userId:number)
  {
    this.confirmationService.confirm({
      message: 'Biztosan fel szeretnéd oldani a felhasználó kitiltását?',
      header: 'Megerősítés',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Igen',
      rejectLabel: 'Nem',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-success',
      accept: () => {
        this.adminService.unbanUser(userId).subscribe();
      },
      reject: () => {
      }
    });
  }
}
