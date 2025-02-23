import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-profile',
  imports: [HeaderComponent, CommonModule, FileUploadModule, AvatarGroupModule, AvatarModule, ButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userProfile: any = {};
  selectedFile: File | null = null;
  userId: number | null = null;
  ownProfile: boolean = false;
  currentUserId = Number(localStorage.getItem('id'));

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const idParam = params.get('id');
      this.userId = idParam ? parseInt(idParam, 10) : null;
    
    });
    if(this.userId!=null && this.userId != this.currentUserId)
      {
        this.loadOtherUserProfile(this.userId);
      }
    else
      {
        this.loadUserProfile();
      }
  }

  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  loadUserProfile(): void {
    this.authService.getUser().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.ownProfile = true;
      },
      error: (err) => {
        console.error('Hiba történt a profil betöltésekor', err);
      }
    });
  }

  loadOtherUserProfile(userId:number)
  {
    this.authService.getOtherUser(userId).subscribe({
      next: (profile) => {
        console.log(profile)
        this.userProfile = profile;
        this.ownProfile = false;
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
