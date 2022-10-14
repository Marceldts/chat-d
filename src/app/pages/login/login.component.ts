import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
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

  onLogin() {
    const { email, password } = this.loginForm.value;
    if (this.tries < 6 && this.loginForm.valid === true) {
      this.authService
        .login(email, password)
        .then(() => this.router.navigate(['/chat']))
        .catch((e) => this.loginError(e));
    }
  }

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
