import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseServiceService } from './firebase-service.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afs: AngularFirestore,) { }
  userData?: User;

  async login(email, password){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password).then((userData) => {
      const { user } = userData;
      sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      token: user['accessToken'],
      email: user.email
      }));
    });
      
    return user;
    }

  async register(email, password, displayName?){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    const user = await createUserWithEmailAndPassword(auth, email, password).then((result) => this.setUserData(result.user))
    
    // .then(function(result) {
    //   return result.user.updateProfile()
    //   ({
    //     displayName: document.getElementById("name").value})}
  }


  async logoff(){
    FirebaseServiceService.getFirebaseConfig()
    const auth = getAuth();
    auth.signOut().then(() => sessionStorage.removeItem('user'));
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }
    return userRef.set(userData, {
      merge: true
    })
  }


}
export interface User {
  uid: string;
  email: string;
  displayName: string
}