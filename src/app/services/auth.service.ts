import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseServiceService } from './firebase-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  async login(email, password){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const { user } = userCredential;
      sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      token: user['accessToken'],
      email: user.email
      }));
    });
      
    return user;
    }

  async register(email, password){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    const user = await createUserWithEmailAndPassword(auth, email, password)
  }

  async logoff(){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    auth.signOut().then(() => sessionStorage.removeItem('user'));
  }

}
