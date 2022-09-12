import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor() { }

  
public static firebaseConfig = {
  apiKey: "AIzaSyCuRL-cKeW_DywkAs3pE9rLg9BgrejA3b8",
  authDomain: "chat-b324a.firebaseapp.com",
  projectId: "chat-b324a",
  storageBucket: "chat-b324a.appspot.com",
  messagingSenderId: "58413901580",
  appId: "1:58413901580:web:4a7cb3dc73427d74a60b29"
  };

  public static getFirebaseConfig(){
    const app = initializeApp(FirebaseServiceService.firebaseConfig);
    return getFirestore(app);
}
}


