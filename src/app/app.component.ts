import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  prefDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  darkTheme = localStorage.getItem('darkTheme')
  constructor() {}

  ngOnInit(): void {
    this.checkTheme();
  }

  checkTheme() {
    if(this.darkTheme != null){
      if (this.darkTheme === 'true') {
        localStorage.setItem('darkTheme', 'true');
        document.body.classList.add('dark')
        document.body.classList.remove('light')
      } else {
        localStorage.setItem('darkTheme', 'false');
        document.body.classList.add('light')
        document.body.classList.remove('dark')
      }
    } else{
      if (this.prefDarkTheme) {
        localStorage.setItem('darkTheme', 'true');
        document.body.classList.add('dark')
        document.body.classList.remove('light')
      } else {
        localStorage.setItem('darkTheme', 'false');
        document.body.classList.add('light')
        document.body.classList.remove('dark')
      }
    }
  }
}
