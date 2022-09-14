import { Component, ElementRef, OnInit, ViewChild, Renderer2, OnDestroy } from '@angular/core';
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

messages: Array<Message> = []
inputMessage: any
ubi: string
end: boolean = false
numScrollTop: number;
numCurrentY: number;
displayName = 'Paquito'
geo: string;

length = 10;
messageList = []

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private messageService: MessageService,
    private renderer: Renderer2
    ) { 
      this.messageService.getMessage().subscribe(m => this.messages = m)
      this.length = 0;
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


  async loadData() {
    if(this.length < this.messages.length){
      await this.wait(500)
      this.infiniteScroll.complete();
      this.append(10)
    }
    else{
      this.infiniteScroll.disabled = true
    }
  }

  async append(n){
    var t = this.length;
    if(t + n <= this.messages.length){
      for(let i = t; i < t + n; i++){
        // await this.showMessage(i)
        length++;
      }
    } else {
      for (let i = t; i < this.messages.length; i++){
        // await this.showMessage(i)
        length++;
      }
    }
  }

  // showMessage(i){
  //   this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
  //   const text = this.inputMessage.value
  // }

  onSendMessage(){
    this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
    const text = this.inputMessage.value
    if(text.length < 1){return null;}
    const date = new Date().toLocaleDateString();
    const user = JSON.parse(sessionStorage.getItem('user')!).email; 
    this.messageService.addMessage(
      user,
      date,
      text,
      this.geo
    )
    this.inputMessage.value = ''
  }

  onLogoff(){
    this.authService.logoff().then(() => this.router.navigate(['']))
  }

  wait(t) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, t);
    });
  }
}
