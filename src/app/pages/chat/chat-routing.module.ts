import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ChatModule } from './chat.module';

const routes: Routes = [
  {
    path: '',
    component: ChatModule,
    title: 'Chat'
  },
  // {
  //   path: '../',
  //   // loadChildren: () => import('src\app\app-routing.module.ts').then( m => m.AppRoutingModule)
  //   component: AppComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
