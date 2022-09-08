import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseServiceService } from './firebase-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async login(email, password){
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const { user } = userCredential;
      sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      token: user['accessToken']
      }));
    });
      
    return user;
    }


}
