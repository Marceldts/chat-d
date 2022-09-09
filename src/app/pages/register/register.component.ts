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
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })
}

  onRegister(){
    const {email, password} = this.registerForm.value;
    this.authService.register(email, password).then(() => 
    this.authService.login(email, password) && this.router.navigate(['/chat']))
  }
}
