import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

@ViewChild (IonContent,{static: true}) content: IonContent;
@ViewChild (IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
@ViewChild ('messagesContent', {static:true}) messagesContent: ElementRef;

messages: Array<Message> = [];
inputMessage: any;
ubi: string;
geo: string;
numScrollTop: number;
numCurrentY: number;
end = false;
slice = 17;



  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private messageService: MessageService,
    ) { 
      Geolocation.getCurrentPosition().then(g=>{
        this.geo = ''+g.coords.latitude.toFixed(2).toString()+', '+g.coords.longitude.toFixed(2).toString();
    }); 
    }

  ngOnInit() {
    //Mirar si puedo usar alguna alternativa al subscribe para que no me cargue todos los mensajes anteriores al login
    this.messageService.getMessage().subscribe((m) =>{
      this.messages = m
    })
    // this.messageList = this.messages.splice(0, this.topLimit)
  }


  loadData(event) {
    setTimeout(() => {
      this.slice += 5;
      this.infiniteScroll.complete();
      if (this.slice > this.messages.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  onSendMessage(){
    this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
    const text = this.inputMessage.value
    if(text.length < 1){return null;}
    const date = Date()
    const user = JSON.parse(sessionStorage.getItem('user')!).email; 
    try {
      this.messageService.addMessage(
        user,
        date,
        text,
        this.geo
      )
    } catch (error) {
        alert('Para poder enviar mensajes, por favor, permite la localización')
    }

    this.inputMessage.value = ''
  }

  onLogoff(){
    if(confirm('¿Seguro que quieres cerrar sesión?')) this.authService.logoff().then(() => this.router.navigate(['']))
  }
}
