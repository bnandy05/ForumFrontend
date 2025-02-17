import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://berenandor.moriczcloud.hu/api/forum';


  constructor() { }
}
