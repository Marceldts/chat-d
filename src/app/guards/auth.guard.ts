import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

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
