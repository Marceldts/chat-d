import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    ) { }

  ngOnInit() {
  }

  onLogoff(){
    this.authService.logoff().then(() => this.router.navigate(['']))
  }

}
