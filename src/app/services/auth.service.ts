import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { FirebaseServiceService } from './firebase-service.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afs: AngularFirestore) {}
  userData?: User;

  //Para iniciar sesión, usamos el método signInWithEmailAndPassword que nos da el FirebaseAuth
  //Una vez iniciada, guardamos en el sessionStorage un objeto 'user', con los campos uid, token, email y password
  async login(email, password) {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(auth, email, password).then(
      (userData) => {
        const { user } = userData;
        sessionStorage.setItem(
          'user',
          JSON.stringify({
            uid: user.uid,
            token: user['accessToken'],
            email: user.email,
            password: password,
          })
        );
      }
    );
    return user;
  }

  //Al registrarnos, lo hacemos con el método 'createUserWithEmailAndPassword' de FirebaseAuth, y guardamos el usedata del usuario que hemos creado
  async register(email, password, displayName?) {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    const user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((result) => this.setUserData(result.user));
  }

  //Al cerrar sesión, borramos también el user del sessionStorage
  async logoff() {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    auth.signOut().then(() => sessionStorage.removeItem('user'));
  }

  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}
export interface User {
  uid: string;
  email: string;
  displayName: string;
}
