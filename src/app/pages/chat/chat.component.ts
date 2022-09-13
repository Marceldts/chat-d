import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'src/app/services/message.service';

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
length: number
end: boolean = false
numScrollTop: number;
numCurrentY: number;
displayName = 'Paquito'

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private el: ElementRef,
    private messageService: MessageService,
    private renderer: Renderer2
    ) { 
      this.messageService.getMessage().subscribe(m => this.messages = m)
      this.length = 0;
    }

  ngOnInit() {
    this.content.ionScroll.subscribe((i) => {
      if(this.numScrollTop<i.detail.scrollTop){
        this.numScrollTop = i.detail.scrollTop
      }
      this.numCurrentY = i.detail.currentY
    })
    this.messageService.getMessage().subscribe((m) =>{
      this.messages = m
    })
  }

  onSendMessage(){
    this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
    const text = this.inputMessage.value
    const date = new Date().toLocaleDateString();
    const geo = null;
    const user = JSON.parse(sessionStorage.getItem('user')!).email; 
    this.messageService.addMessage(
      user,
      date,
      text,
      geo
    )
    this.inputMessage.value = ''
  }


  onLogoff(){
    this.authService.logoff().then(() => this.router.navigate(['']))
  }

  compScroll(): boolean{
    if(length === this.messages.length){
      if(this.numCurrentY === this.numScrollTop){
        this.end = true;
      }else{
        this.end = false;
      }
    }else{
      this.end=false;
    }
    return this.end;
  }


  wait(t) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, t);
    });
  }
}
