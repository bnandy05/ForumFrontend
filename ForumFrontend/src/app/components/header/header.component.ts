import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  username: string = '';
  items: any[] = [
    {
      label: 'Kezdőlap',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    {
        label: 'Topic Feltöltés',
        icon: 'pi pi-laptop',
        routerLink: ['/create'] 
    },
    {
        label: 'Én Topicjaim',
        icon: 'pi pi-mobile',
        routerLink: ['/My-topics']

    }
  ];
  secondaryitems: any[] = [
    {
      label: 'Profil',
      icon: 'pi pi-info-circle',
      routerLink: ['/profile']
    },
    {
      label: 'Kijelentkezés',
      icon: 'pi pi-info-circle',
      routerLink: ['/logout']
    }
  ]

  constructor(private authService: AuthService,
    private router: Router
  )
  {}

  ngOnInit() {
    this.authService.getUser().subscribe(
      (user: any) => {
        this.username = user.name;
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.username = "";
        this.router.navigate(['/logout']);
      }
    );
  }
}
