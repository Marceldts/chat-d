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

   addMessage(msg: Message){
    this.messageDB.push(msg)
    // this.messageDB.push({

    //   user: 'ManolitoPiesDePlata',

    //   date: new Date().toLocaleDateString(),

    //   text: 'Mensaje de prueba',

    //   geo: null

    // });
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
  geo: string;
}
