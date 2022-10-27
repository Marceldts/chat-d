import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonInfiniteScroll,
  IonModal,
  IonToggle,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
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

  user = JSON.parse(sessionStorage.getItem('user')!).email;
  username = JSON.parse(sessionStorage.getItem('user')!).username;
  password = JSON.parse(sessionStorage.getItem('user')!).password;
  darkTheme = localStorage.getItem('darkTheme');
  fontSize = localStorage.getItem('fontSize');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private messageService: MessageService
  ) {}

  //Al entrar en el componente, nos suscribimos al servicio de mensajes para poder mostrarlos y, dependiendo
  //de la cantidad de mensajes que haya, se enseñarán todos o los 12 últimos
  ngOnInit() {
    this.subscribeMessages();

    this.themeToggle();
    this.setFontSize();

    this.scrollToBottomSetTimeOut(1100);
    this.onGeoReady();
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

  onGeoReady() {
    Geolocation.getCurrentPosition().then((g) => {
      this.geo =
        '' +
        g.coords.latitude.toFixed(2).toString() +
        ', ' +
        g.coords.longitude.toFixed(2).toString();
    });
  }

  //Para enviar un mensaje, tenemos que guardar el texto del input en una variable
  //Una vez tengamos el texto, guardamos la fecha y el tipo y añadimos el mensaje al servicio de mensajes
  //Al acabar, borramos el texto del input y scrolleamos al final
  onSendMessage() {
    this.inputMessage = document.querySelector('#inputMessage')
    const text = this.inputMessage.value;
    if (text.length < 1) {
      console.log(text)
      return null;
    }
    const date = Date.now().toString();
    this.type = 'txt';
    try {
      this.messageService.addMessage(
        this.user,
        this.username,
        date,
        text,
        this.geo,
        this.type
      );
    } catch (error) {
      //Si quiero que la ubicación sea necesaria, puedo lanzar esta alerta en vez de añadir el msg
      //alert('Para poder enviar mensajes, por favor, permite la localización');
      console.log('Llega al error geo')
      this.geo = 'No permission to access location';
      this.messageService.addMessage(
        this.user,
        this.username,
        date,
        text,
        this.geo,
        this.type
      );
    }

    this.inputMessage.value = '';
    this.scrollToBottomSetTimeOut(10);
  }

  onDelete(msg) {
    //Si quiero que aparezca el mensaje, he de usar el método update y no remove de la db y actualizar manualmente el texto del div
    if (msg.user === this.user) {
      if (confirm('¿Seguro que quieres borrar el mensaje?')) {
        this.messageService.deleteMessage(msg.$key);
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
      this.messageService.addMessage(
        this.user,
        this.username,
        date,
        image.dataUrl,
        this.geo,
        this.type
      );
    } catch (error) {
      this.geo = 'No permission to access location';
      this.messageService.addMessage(
        this.user,
        this.username,
        date,
        image.webPath,
        this.geo,
        this.type
      );
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

  onChangePass(){
    this.changePass = document.getElementById('changePass')

    var newPass = (<any>this.changePass).value
    this.authService.changePassword(newPass)
    alert('Contraseña actualizada!')
  }
  
  onSaveConfig(){
    // this.changeUser = document.getElementById('changeUser')
    this.changePass = document.getElementById('changePass')

    // var newUser = (<any>this.changeUser).value
    var newPass = (<any>this.changePass).value

    if(newPass) {
      if(newPass.length < 6) {
        alert('La nueva contraseña no es válida: no llega a tener 6 carácteres')
        return null
      }
      if(newPass != this.password) {
        this.authService.changePassword(newPass)
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

  modalData(username){
    console.log(username)
  }
}
