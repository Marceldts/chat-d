import { Injectable } from '@angular/core';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messageDB: AngularFireList<Message>;

  //La BD de mensajes es la lista '/messages' de la db principal de firebase, y la ordenamos por el campo 'date' del propio mensaje
  constructor(private db: AngularFireDatabase) {
    this.messageDB = this.db.list('/messages', (ref) =>
      ref.orderByChild('date')
    );
  }

  addMessage(user: string, username: string, date: string, text: string, geo: string, type: string) {
    console.log('Llega al service')
    try {
      this.messageDB.push({
        user,
        username,
        date,
        text,
        geo,
        type
      });
      
    } catch (error) {
      alert(error)
    }
  }

  deleteMessage(key){
    //Si lo que quiero es que aparezca el texto 'Este mensaje ha sido eliminado', he de usar el método de arriba
    //Si quiero borrarlo directamente, lo que he de hacer es usar el método de abajo
    
    this.messageDB.remove(key)
    // this.messageDB.update(key, {text: 'Este mensaje ha sido eliminado'})
  }

  getMessage(): Observable<Message[]> {
    return this.messageDB
      .snapshotChanges()
      .pipe(
        map((changes) => changes.map((c) => this.getUserFromPayload(c.payload)))
      );
  }

  getUserFromPayload(payload: any): Message {
    return {
      $key: payload.key,
      ...payload.val(),
    };
  }
}

export interface Message {
  $key?: string;
  user: string;
  username: string;
  date: string;
  text: string;
  geo?: string;
  type: string
}
