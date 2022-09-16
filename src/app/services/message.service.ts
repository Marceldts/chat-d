import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageDB: AngularFireList<Message>

  constructor(private db: AngularFireDatabase) {
    this.messageDB = this.db.list('/messages', (ref) => ref.orderByChild('date'))
   }

  addMessage(user: string, date: string, text: string, geo:string){
    this.messageDB.push({
      user, date, text, geo
    });
  }

  getMessage(): Observable<Message[]>{
    return this.messageDB.snapshotChanges().pipe(map((changes) => changes.map((c) => this.getUserFromPayload(c.payload))))
  }

  getUserFromPayload(payload: any): Message{
    return{
      $key: payload.key,
      ...payload.val()
    }
  }

}

export interface Message {
  $key?: string;
  user: string;
  date: string;
  text: string;
  geo?: string;
}
