import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private readonly router: Router){}

  canActivate(): any{
    if(sessionStorage.getItem('user')){
      return true;
    } else {
      this.router.navigate(['/login'])
    }
  }

  
  
}
