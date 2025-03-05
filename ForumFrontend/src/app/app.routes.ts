import { AdminNewCategoryComponent } from './components/admin/admin-new-category/admin-new-category.component';
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './no-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'logout',
    loadComponent: () => import('./components/auth/logout/logout.component').then(m => m.LogoutComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    canActivate: [NoAuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./components/user/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'create',
    loadComponent: () => import('./components/topics/topic-create/topic-create.component').then(m => m.TopicCreateComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    loadComponent: () => import('./components/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-topics',
    loadComponent: () => import('./components/topics/my-topics/my-topics.component').then(m => m.MyTopicsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/user/:id',
    loadComponent: () => import('./components/topics/my-topics/my-topics.component').then(m => m.MyTopicsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/modify/:id',
    loadComponent: () => import('./components/topics/topic-create/topic-create.component').then(m => m.TopicCreateComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'topics/view/:id',
    loadComponent: () => import('./components/topics/topic-details/topic-details.component').then(m => m.TopicDetailsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-home',
    loadComponent: () => import('./components/admin/admin-home/admin-home.component').then(m => m.AdminHomeComponent),
    // canActivate: [AuthGuard],
  },
  {
    path: 'admin-table',
    loadComponent: ()=> import('./components/admin/admin-table/admin-table.component').then(m => m.AdminTableComponent),
  },
  {
    path: 'admin-new-category',
    loadComponent: ()=> import('./components/admin/admin-new-category/admin-new-category.component').then(m => m.AdminNewCategoryComponent),
  }

];
