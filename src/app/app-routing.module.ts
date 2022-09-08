import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    title: 'Inicio'
  },
  {
    path: 'login',
     loadChildren: () => import('./pages/login/login.module').then( m => m.LoginModule),
    // component: LoginComponent,
    title: 'Inicio de sesión'
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterModule),
    // component: RegisterComponent,
    title: 'Registro'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
