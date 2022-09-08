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
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}


}
