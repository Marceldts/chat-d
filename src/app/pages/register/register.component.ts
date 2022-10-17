import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.checkForm();
  }

  //Añadimos los validadores al form (el último del mail significa que ha de tener algo antes y después del @ y ha de acabar en . y 2-4 carácteres)
  checkForm() {
    this.registerForm = this.fb.group({
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

  onRegister() {
    const { email, password } = this.registerForm.value;
    this.authService
      .register(email, password)
      .then(() =>
        this.authService
          .login(email, password)
          .then(() => this.router.navigate(['/chat']))
      )
      .catch((e) => alert(e));
  }
}
