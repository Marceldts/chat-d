import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  updateCurrentUser,
  updatePassword,
  updateProfile,
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
            username: user.displayName,
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
    ).then((result) => this.setUserData(result.user, displayName));
  }

  //Al cerrar sesión, borramos también el user del sessionStorage
  async logoff() {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    auth.signOut().then(() => sessionStorage.removeItem('user'));
  }

  deleteUserData() {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(
        `users/${user.uid}`
      );
      userRef
        .get()
        .toPromise()
        .then(() => {
          let deleteDoc = this.afs.collection('users').doc(user.uid);
          deleteDoc.delete();
        });
    } catch (error) {
      console.log('No hay coincidencias en la base de datos');
    }
  }

  setUserData(user, displayName) {
    updateProfile(user, { displayName: displayName });

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  changePassword(newPass) {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    updatePassword(auth.currentUser, newPass);
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        uid: auth.currentUser.uid,
        token: auth.currentUser['accessToken'],
        email: auth.currentUser.email,
        username: auth.currentUser.displayName,
        password: newPass,
      })
    );
  }

  changeUsername(newUser, password) {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    this.setUserData(auth.currentUser, newUser);
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        uid: auth.currentUser.uid,
        token: auth.currentUser['accessToken'],
        email: auth.currentUser.email,
        username: newUser,
        password: password,
      })
    );
    alert('Nombre de usuario actualizado!');
  }

  async reauth(user, password) {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user, password);
    let valid = false;

    await reauthenticateWithCredential(auth.currentUser, credential).then(
      () => {
        this.deleteAccount();
        alert('Cuenta borrada satisfactoriamente');
        valid = true;
      },
      () => {
        alert('Los datos introducidos no son correctos');
        valid = false;
      }
    );
    return valid;
  }

  async deleteAccount() {
    FirebaseServiceService.getFirebaseConfig();
    const auth = getAuth();
    await this.deleteUserData();
    await auth.currentUser.delete();
  }
}
export interface User {
  uid: string;
  email: string;
  displayName: string;
}
