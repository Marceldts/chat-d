import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import {
  AlertController,
  IonContent,
  IonInfiniteScroll,
  IonModal,
  IonToggle,
  ScrollDetail,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit{
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('messagesContent', { static: true }) messagesContent: ElementRef;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonToggle) tog: IonToggle;

  messages: Array<Message> = [];
  inputMessage: any;
  // changeUser: any;
  changePass: any;
  ubi: string;
  geo: string;
  type: string;
  end = false;
  slice = 0;
  ind;

  user
  username
  password
  darkTheme = localStorage.getItem('darkTheme');
  fontSize = localStorage.getItem('fontSize');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private messageService: MessageService,
    private alertController: AlertController
  ) {}

  //Al entrar en el componente, nos suscribimos al servicio de mensajes para poder mostrarlos y, dependiendo
  //de la cantidad de mensajes que haya, se enseñarán todos o los 12 últimos
  ngOnInit() {
    this.subscribeNavigationEnd()

    this.themeToggle();
    this.setFontSize();
    
    this.subscribeMessages();
    this.scrollToBottomSetTimeOut(1100);
    this.onGeoReady();
  }

  //Angular recicla los componentes, por lo que si intentamos entrar de nuevo cambiando de usuario nos cargará el anterior chat component
  //(el que tiene los datos del usuario anterior) hasta que refresquemos la página, ya que ahí se vuelve a cargar el componente entero
  //(por tanto, se vuelve a ejecutar ngInit y se vuelve a dar valor a las variables que tenemos declaradas)
  //Para que funcione como nosotros queremos (es decir, que cada vez que iniciamos sesión se ponga correctamente el componente del chat),
  //podemos hacerlo escuchando la primera vez que aparezca el evento 'NavigationEnd' en el chat. Este evento salta cuando el router acaba de
  //navegar a otra ruta, por lo que la primera vez que aparezca al entrar en este chat será cuando entre (solo nos interesa la primera, para esto 
  //nos da igual lo que pase cuando entre en otro componente). No hace falta desuscribirse gracias al método first, que solo recoge la
  //primera aparición del evento
  async subscribeNavigationEnd(){
    this.router.events
      .pipe(
        first((ev) => ev instanceof NavigationEnd)
      )
      .subscribe((ev) => {
         // handle navigation start event
         this.user = JSON.parse(sessionStorage.getItem('user')).email;
         this.username = JSON.parse(sessionStorage.getItem('user')).username;
         this.password = JSON.parse(sessionStorage.getItem('user')).password;
      });
  }

  themeToggle() {
    const toggle = document.querySelector('#themeToggle');
    this.darkTheme = localStorage.getItem('darkTheme');
    this.fontSize = localStorage.getItem('fontSize');

    if (this.darkTheme === 'true') {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }

    // Listen for the toggle check/uncheck to toggle the dark class on the <body>
    toggle.addEventListener('ionChange', (ev) => {
      document.body.classList.toggle('dark', (<any>ev).detail.checked);
      document.body.classList.toggle('light', !(<any>ev).detail.checked);
      if (this.darkTheme === 'true') {
        localStorage.setItem('darkTheme', 'false');
      }
      if (this.darkTheme === 'false') {
        localStorage.setItem('darkTheme', 'true');
      }
      this.darkTheme = localStorage.getItem('darkTheme');
    });
  }

  setFontSize() {
    if (this.fontSize == null || this.fontSize == 'Normal') {
      localStorage.setItem('fontSize', 'Normal');
      document.body.classList.add('normal');
      document.body.classList.remove('peque');
      document.body.classList.remove('grande');
    } else if (this.fontSize == 'Pequeña') {
      document.body.classList.remove('normal');
      document.body.classList.add('peque');
      document.body.classList.remove('grande');
    } else {
      document.body.classList.remove('normal');
      document.body.classList.remove('peque');
      document.body.classList.add('grande');
    }

    this.fontSize = localStorage.getItem('fontSize');
  }

  subscribeMessages() {
    this.messageService.getMessage().subscribe((m) => {
      this.messages = m;
    });
    switch (true) {
      case this.messages.length <= 12:
        this.ind = 0;
      case this.messages.length > 12 && this.messages.length < 24:
        this.ind = 12;
      default:
        this.ind = this.messages.length - 12;
    }
  }

  scrollToBottomSetTimeOut(time) {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, time);
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    if (ev.detail.scrollTop == 0) {
      if (confirm('¿Quieres cargar mensajes anteriores?')) {
        if (this.messages.length - this.ind < 0) {
          alert('No hay mensajes anteriores');
          return null;
        }
        this.ind = this.ind - 12;
      }
    }
  }

  //Dejo el método aunque ya no haga nada por si decido volver a cargar los mensajes desde el principio e ir paginándolos
  loadData(event) {
    setTimeout(() => {
      this.slice += 5;
      this.infiniteScroll.complete();
      if (this.slice > this.messages.length) {
        event.target.disabled = true;
      }
    }, 100);
  }

  async onGeoReady() {
    try {
      await Geolocation.getCurrentPosition().then((g) => {
        this.geo =
          '' +
          g.coords.latitude.toFixed(2).toString() +
          ', ' +
          g.coords.longitude.toFixed(2).toString();
      });
    } catch (error) {
      this.geo = 'No permission to access location';
    }
  }

  //Para enviar un mensaje, tenemos que guardar el texto del input en una variable
  //Una vez tengamos el texto, guardamos la fecha y el tipo y añadimos el mensaje al servicio de mensajes
  //Al acabar, borramos el texto del input y scrolleamos al final
  async onSendMessage() {
    this.inputMessage = document.querySelector('#inputMessage');
    const text = this.inputMessage.value;
    if (text.length < 1) {
      return null;
    }
    const date = Date.now().toString();
    this.type = 'txt';
    this.ind--;
    await this.messageService.addMessage(
      this.user,
      this.username,
      date,
      text,
      this.geo,
      this.type
    );

    this.inputMessage.value = '';
    this.scrollToBottomSetTimeOut(10);
  }

  onDelete(msg) {
    //Si quiero que aparezca el mensaje, he de usar el método update y no remove de la db y actualizar manualmente el texto del div
    if (msg.user === this.user) {
      if (confirm('¿Seguro que quieres borrar el mensaje?')) {
        this.messageService.deleteMessage(msg.$key);
        this.ind++
        // msg.text = 'Este mensaje ha sido eliminado'
      }
    }
  }

  onLogoff() {
    if (confirm('¿Seguro que quieres cerrar sesión?'))
      this.authService
        .logoff()
        .then(() => alert('Sesión cerrada con éxito'))
        .then(() => this.router.navigate(['']));
  }

  //Al lanzar el método, hacemos que el plugin de la cámara haga una foto con los parámetros que le damos
  //Una vez tengamos la foto hecha, mandaremos el mensaje cambiando el texto por la url de la imágen y haciendo que el mensaje sea de tipo img
  async onTakePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      saveToGallery: true,
      resultType: CameraResultType.DataUrl,
    });
    const date = Date.now().toString();
    this.type = 'img';
    try {
      this.ind--;
      this.messageService.addMessage(
        this.user,
        this.username,
        date,
        image.dataUrl,
        this.geo,
        this.type
      );
    } catch (error) {
      alert(error);
    }
  }

  onSelectFontSize(ev) {
    this.fontSize = ev.target.value;
    localStorage.setItem('fontSize', this.fontSize);
    this.setFontSize();
  }

  onSetDefaultValues() {
    localStorage.setItem('darkTheme', 'false');
    localStorage.setItem('fontSize', 'Normal');

    this.tog.checked = false;

    document.body.classList.remove('dark');
    document.body.classList.add('light');
    document.body.classList.add('normal');
    document.body.classList.remove('peque');
    document.body.classList.remove('grande');

    this.modal.dismiss();
  }

  onCloseModal() {
    this.modal.dismiss();
  }

  onChangePass() {
    this.changePass = document.getElementById('changePass');

    var newPass = (<any>this.changePass).value;
    this.authService.changePassword(newPass);
    alert('Contraseña actualizada!');
  }

  onSaveConfig() {
    // this.changeUser = document.getElementById('changeUser')
    this.changePass = document.getElementById('changePass');

    // var newUser = (<any>this.changeUser).value
    var newPass = (<any>this.changePass).value;

    if (newPass) {
      if (newPass.length < 6) {
        alert(
          'La nueva contraseña no es válida: no llega a tener 6 carácteres'
        );
        return null;
      }
      if (newPass != this.password) {
        this.authService.changePassword(newPass);
      } else {
        alert('La nueva contraseña no puede coincidir con la anterior');
      }
    }
    // if(newUser) {
    //   if(newUser.length < 2) {
    //     alert('La nueva contraseña no es válida: no llega a tener 6 carácteres')
    //     return null
    //   }
    //   if(newUser != this.username) {
    //     this.authService.changeUsername(newUser, this.password)
    //   }
    // }
  }

  onDeleteAccount() {
    if (
      confirm(
        '¿Estás seguro de que quieres borrar tu cuenta?\n Si lo haces, no podrás volver a acceder con tus credenciales, tendrás que registrarte de nuevo'
      )
    ) {
      this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Por favor, vuelve a introducir tus credenciales',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            alert.dismiss();
          },
        },
        {
          text: 'OK',
          handler: async (alertData) => {
            const res = await this.authService.reauth(
              alertData[0],
              alertData[1]
            );
            if (res) {
              alert.dismiss();
              this.onCloseModal();
              this.authService.logoff();
              this.router.navigate(['']);
            }
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Correo electrónico',
        },
        {
          placeholder: 'Contraseña',
          type: 'password',
          attributes: {
            minlength: 6,
          },
        },
      ],
    });

    await alert.present();
  }
}
