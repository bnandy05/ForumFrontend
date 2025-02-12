import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { TopicCreateComponent } from './components/topics/topic-create/topic-create.component';
import { TopicDetailsComponent } from './components/topics/topic-details/topic-details.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'header',
        component: HeaderComponent
    },
    {
        path: 'topics/create',
        component: TopicCreateComponent
    },
    {
        path: 'topics/:id',
        component: TopicDetailsComponent
    }
];