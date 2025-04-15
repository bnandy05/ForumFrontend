import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.passwordForm = this.fb.group({
      current_password: ['', [Validators.required]],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_new_password: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  get currentPassword() { return this.passwordForm.get('current_password'); }
  get newPassword() { return this.passwordForm.get('new_password'); }
  get confirmNewPassword() { return this.passwordForm.get('confirm_new_password'); }

  passwordsMatch(formGroup: FormGroup) {
    const newPassword = formGroup.get('new_password')?.value;
    const confirmNewPassword = formGroup.get('confirm_new_password')?.value;
    return newPassword === confirmNewPassword ? null : { passwordsNotMatch: true };
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;
    const { current_password, new_password, confirm_new_password } = this.passwordForm.value;
  
    this.authService.changePassword(current_password, new_password, confirm_new_password);
  }
  
}
