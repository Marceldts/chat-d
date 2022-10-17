import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user = JSON.parse(sessionStorage.getItem('user')!).email;
  password = JSON.parse(sessionStorage.getItem('user')!).password;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  //No podemos acceder al chat si no hay un usuario en el sessionStorage
  canActivate(): any {
    if (sessionStorage.getItem('user')) {
      this.checkUser();
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  //Este método está para comprobar que se ha manipulado el sessionStorage una vez hemos iniciado la sesión, ya que
  //intenta iniciar sesión con el usuario y contraseña guardados ahí y, si no puede, cierra la sesión y nos manda a inicio
  checkUser() {
    this.authService.login(this.user, this.password).catch(() =>
      this.authService
        .logoff()
        .then(() => alert('Los datos de usuario no son correctos'))
        .then(() => this.router.navigate(['']))
    );
  }
}
