import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { IonicModule } from '@ionic/angular';
import { ChatComponent } from './chat.component';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import {} from '@angular/fire/database';


@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    IonicModule,
  ]
})
export class ChatModule { }
