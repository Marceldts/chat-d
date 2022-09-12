import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { LoginComponent } from '../login/login.component';
import { LoginModule } from '../login/login.module';
import { RegisterComponent } from '../register/register.component';
import { ChatComponent } from '../chat/chat.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component:HomeComponent
  },
//   {
//   path: 'login',
//   loadChildren: () => import('../login/login.module').then( m => m.LoginModule),
//   // component: LoginComponent,
//   title: 'Inicio de sesión'
// },
// {
//   path: 'register',
//   // loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterModule),
//    component: RegisterComponent,
//   title: 'Registro'
// },
// {
//   path: 'chat',
//   canActivate: [AuthGuard],
//   // // loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatModule),
//   component: ChatComponent
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
