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
      this.numScrollTop = 0;
      this.numCurrentY = 0;
      
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
      this.appendItems(30)
    })
  }

  onSendMessage(){
    this.inputMessage = this.el.nativeElement.getElementsByTagName('input')[0];
    const text = this.inputMessage
    const date = new Date().toLocaleDateString();
    const user = 'ManolitoPiesDePlata',
    geo = null;
    this.messageService.addMessage({
      user,
      date,
      text,
      geo
    })
    this.inputMessage.value = ''
    this.scrollToEnd();
    console.log(this.inputMessage.value + sessionStorage.getItem('user'))
    // console.log(this.inputMessage.value + sessionStorage["user[email]"])
  }

  async scrollToEnd(){
    if(length<this.messages.length){
      while(length<this.messages.length){
        await this.loadData();
        setTimeout(()=>{this.content.scrollToBottom(500);},300);
      }
      }else{
        setTimeout(()=>{this.content.scrollToBottom(500);},300);
      }
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

  async loadData(){
    if(length < this.messages.length){
      await this.wait(500)
      this.infiniteScroll.complete();
      this.appendItems(10)
    } else{
      this.infiniteScroll.disabled = true;
    }
  }

  wait(t) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, t);
    });
  }

  async appendItems(n){      
    var size = length;

    if (size+n<=this.messages.length){
      for (var i = size; i < size+n; i++) {
        await this.showMessage(i);
        length++;
      }
    }else{
      for (var i = size; i < this.messages.length; i++) {
        await this.showMessage(i);
        length++;  
      }
    }
  }

  showMessage(i){
    const mensajesContenido = this.messagesContent.nativeElement;
    const myMessages = this.renderer.createElement('div');
    const otherMessages = this.renderer.createElement('div');
    const data = this.renderer.createElement('div');
    myMessages.className = 'myMessages';
    otherMessages.className = 'otherMessages';
    data.className = 'data';

    if(this.messages[i].user === this.authService.userData.email){
      const myel = this.renderer.createElement('div');
      myel.className = 'myMessage'
      myel.innerHTML = '';
      if (this.messages[i]?.user!==this.messages[i-1]?.user){
        const bold = this.renderer.createElement('div');
        bold.className = 'meBold'
        bold.innerHTML += `Yo`;
        this.renderer.appendChild(myel,bold);
      }
      myel.innerHTML += `${this.messages[i].text}`;
      if (this.messages[i]?.geo!==undefined){
        data.innerHTML = `${this.messages[i].geo}`;
        this.renderer.appendChild(myel,data);
      }
      this.renderer.appendChild(myMessages,myel);
      this.renderer.appendChild(mensajesContenido,myMessages);
    }else{
      const el = this.renderer.createElement('div');
      el.className = 'message'
      el.innerHTML = '';
      if (this.messages[i]?.user!==this.messages[i-1]?.user){
        const bold = this.renderer.createElement('div');
        bold.className = 'bold'
        bold.innerHTML += `${this.messages[i].user}`;
        this.renderer.appendChild(el,bold);
      }
      el.innerHTML += `${this.messages[i].text}`;
      if (this.messages[i]?.geo!==undefined){
        data.innerHTML = `${this.messages[i].geo}`;
        this.renderer.appendChild(el,data);
      }
      this.renderer.appendChild(otherMessages,el);
      this.renderer.appendChild(mensajesContenido,otherMessages);
    }
  }

}
