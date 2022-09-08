import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    password: ['', Validators.required]
  })
}

  onRegister(){
    const {email, password} = this.registerForm.value;
    this.authService.register(email, password)
  }
}
