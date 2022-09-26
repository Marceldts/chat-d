import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonDatetime, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('messagesContent', { static: true }) messagesContent: ElementRef;

  messages: Array<Message> = [];
  inputMessage: any;
  ubi: string;
  geo: string;
  numScrollTop: number;
  numCurrentY: number;
  end = false;
  slice = 0;
  ind;
  user = JSON.parse(sessionStorage.getItem('user')!).email;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
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
    this.scrollToBottomSetTimeOut(1100);
    this.onGeoReady();
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

  onSendMessage() {
    this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
    const text = this.inputMessage.value;
    if (text.length < 1) {
      return null;
    }
    const date = Date.now().toString();
    try {
      this.ind--;
      this.messageService.addMessage(this.user, date, text, this.geo);
    } catch (error) {
      //Si quiero que la ubicación sea necesaria, puedo lanzar esta alerta en vez de añadir el msg
      //alert('Para poder enviar mensajes, por favor, permite la localización');
      this.geo = 'No permission to access location';
      this.messageService.addMessage(this.user, date, text, this.geo);
    }

    this.inputMessage.value = '';
    this.scrollToBottomSetTimeOut(10);
  }

  onLogoff() {
    if (confirm('¿Seguro que quieres cerrar sesión?'))
      this.authService.logoff().then(() => alert('Sesión cerrada con éxito')).then(() => this.router.navigate(['']));
  }
}
