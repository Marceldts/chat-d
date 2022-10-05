import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ChatRoutingModule } from './chat-routing.module';
import { IonicModule } from '@ionic/angular';
import { ChatComponent } from './chat.component';
import { FirebaseServiceService } from 'src/app/services/firebase-service.service';
import {} from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, ChatRoutingModule, IonicModule],
  providers: [LoginComponent, AuthService],
})
export class ChatModule {}
