import { Routes } from '@angular/router';
  

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => 
          import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () => 
          import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => 
          import('./components/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => 
          import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'profile',
        loadComponent: () => 
          import('./components/user/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'topics',
        children: [
          {
            path: 'create',
            loadComponent: () => 
              import('./components/topics/topic-create/topic-create.component').then(m => m.TopicCreateComponent)
          },
          {
            path: ':id',
            loadComponent: () => 
              import('./components/topics/topic-details/topic-details.component').then(m => m.TopicDetailsComponent)
          }
        ]
      },
      {
        path: '**',
        redirectTo: ''
      }
];
