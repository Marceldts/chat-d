import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  prefDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
  darkTheme = localStorage.getItem('darkTheme')
  fontSize = localStorage.getItem('fontSize')
  constructor() {}

  ngOnInit(): void {
    this.checkTheme();
    this.setFontSize();
    console.log(this.fontSize)
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

  setFontSize(){
    if(this.fontSize == null || this.fontSize == 'Normal'){
      localStorage.setItem('fontSize', 'Normal');
        document.body.classList.add('normal')
        document.body.classList.remove('peque')
        document.body.classList.remove('grande')
    } else if (this.fontSize == 'Pequeña'){
      document.body.classList.remove('normal')
        document.body.classList.add('peque')
        document.body.classList.remove('grande')
    } else{
      document.body.classList.remove('normal')
        document.body.classList.remove('peque')
        document.body.classList.add('grande')
    }
  }
}
