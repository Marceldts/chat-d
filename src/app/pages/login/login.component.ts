import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;  

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
      password: ['', Validators.required]
    })
    this.loginForm.valueChanges.subscribe(values => console.log(values))
  }

  onLogin(){
    console.log('Por lo menos el botón funciona')
    const { email, data } = this.loginForm.value;
    this.authService.login(email, data)
  }

}
