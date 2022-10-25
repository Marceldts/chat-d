import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { IonicModule } from '@ionic/angular';
import { ChatComponent } from './chat.component';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, ChatRoutingModule, IonicModule],
  providers: [AuthService],
})
export class ChatModule {}
