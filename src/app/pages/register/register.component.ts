import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { async } from '@firebase/util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  check = document.querySelector('#condition');
  termsRead = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.checkForm().then(() =>this.checkboxListener())
  }

  async checkboxListener(){
    const check = document.querySelector('#condition');
    // if(!this.termsRead) this.check.ariaDisabled
    check.addEventListener('ionChange', (ev) => {
      // if(this.termsRead) (<any>this.check).checked = true
      console.log((<any>ev).detail.checked)
      if(this.termsRead && (<any>ev).detail.checked){
        (<any>check).checked = true
      } else {
        (<any>check).checked = false
      }
      if(!(<any>ev).detail.checked && !this.termsRead){
        this.presentAlert()
      }
    });
  }

  //Añadimos los validadores al form (el último del mail significa que ha de tener algo antes y después del @ y ha de acabar en . y 2-4 carácteres)
  async checkForm() {
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
      username: ['', Validators.required],
      termsAgreed: [false, Validators.requiredTrue]
    });
  }

  onRegister() {
    const { email, password, username } = this.registerForm.value;
    this.showLoading().then(() => 
    this.authService
      .register(email, password, username)
      .then(() => this.authService.login(email, password))
      .then(() => this.router.navigate(['/chat']))
      .catch((e) => alert(e)))
  }

  async showLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...',
      duration: 2000
    })
    loading.present()
  }

  // onConditionModal(){
  //   this.presentAlert()
  // }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones de uso',
      buttons: [
        {
          text: 'Cancelar',
          // role: 'cancel',
          handler: async() => {
            alert.dismiss()
          }
        },
        {
          text: 'Acepto',
          // role: 'confirm',
          handler: async () => {
            this.termsRead = true
            alert.dismiss()
          },
        },
      ],
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tellus orci, bibendum quis nisl ut, tincidunt maximus lorem. Nam nec tincidunt ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur eget porttitor urna. Proin ornare egestas tempus. Quisque vel sodales sapien. Aenean eget lobortis nulla.'
    });

    await alert.present();
  }
}


