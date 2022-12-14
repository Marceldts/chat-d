import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  tries = 0;
  triesMax: Boolean;
  timeRem = this.el.nativeElement.getElementsByTagName('timeRem');
  loading = this.loadingCtrl.create({
    message: 'Intentando iniciar sesión...',
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit(): void {
    this.checkForm().then(() => this.checkMail());
  }

  //Añadimos los validadores al form (el último del mail significa que ha de tener algo antes y después del @ y ha de acabar en . y 2-4 carácteres)
  async checkForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  //Cambiamos el tipo de check a any porque la propiedad checked no existe en el elemento, al ser una propiedad especifica de un 
  //componente de ionic
  checkMail() {
    const email = document.querySelector('#email');
    const check = document.querySelector('#rememberEmail');
    if (localStorage.getItem('email')) {
      email.setAttribute('value', localStorage.getItem('email'));
      (<any>check).checked = true
    }
  }
  
  saveEmail() {
    const check = document.querySelector('#rememberEmail');
    if (check.ariaChecked == 'true') {
      localStorage.setItem('email', this.loginForm.value.email);
    } else {
      localStorage.removeItem('email')
    }
  }

  //Para poder iniciar sesión, los campos del form han de ser válidos y no se ha tenido que superar el máximo de intentos
  onLogin() {
    const { email, password } = this.loginForm.value;
    if (this.tries < 6 && this.loginForm.valid === true) {
      this.showLoading().then(() =>
        this.authService
          .login(email, password)
          .then(() => this.saveEmail())
          .then(() => this.router.navigate(['/chat']))
          .then(async () => (await this.loading).dismiss())
          .catch((e) => this.loginError(e))
      );
    }
  }

  async showLoading() {
    (await this.loading).present();
  }

  //Cuando ocurre un error al intentar iniciar sesión (usuario no registrado/contraseña incorrecta),
  //aumentamos el número de intentos y comprobamos que este número sea menor que el max (en este caso 6)
  //Si no es menor que 6, hacemos un timeout de 10 segundos en los que no se puede iniciar sesión,
  //y mostramos por pantalla el tiempo que queda para poder iniciar sesión
  loginError(e) {
    this.tries++;
    let timeAux = 10;
    alert(e);
    if (this.tries >= 6) {
      this.triesMax = true;
      setTimeout(() => {
        this.tries = 0;
        this.triesMax = false;
      }, 10000);

      const int = setInterval(function () {
        timeAux--;
        this.timeRem.innerText =
          'Para poder volver a iniciar sesión, espera ' + timeAux + ' segundos';
      }, 1000);
      setTimeout(() => clearInterval(int), 10000);
    }
  }
}
