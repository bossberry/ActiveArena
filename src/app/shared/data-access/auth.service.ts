import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { User } from '../models/users.model';
import { UserService } from './user.service';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  afAuth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  userService = inject(UserService);

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider)
      .then(result => {
        this.saveUserData(result.user);
        console.log('You have been successfully logged in!', result);
        this.router.navigate(['/user-profile']);
      }).catch(error => {
        console.error('Login failed:', error);
      });
  }

  getUserProfile(): Observable<any> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          return user
        } else {
          return of(null); // Return Observable of null if not logged in
        }
      })
    );
  }

  private updateUserData(user: firebase.User | null) {
    if (!user) return;
    const userRef = this.firestore.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Anonymous',
      mobileNo: '',
      height: 0,
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      roles: '',
      profileCompleted: true
    };

    return userRef.set(data, { merge: true });
  }

  saveUserData(user: firebase.User | null) {
    if (user) {
      const userRef = this.firestore.collection('users').doc(user.uid);
      userRef.get().toPromise().then(doc => {
        if (doc && !doc.exists) {
          const newUser: User = {
            uid: user.uid,
            email: user.email ?? '',
            mobileNo: '',
            displayName: user.displayName ?? '',
            height: 0,
            photoURL: user.photoURL ?? '',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            roles:'',
            profileCompleted: false
          };
          userRef.set(newUser);
        } else {
          userRef.update({
            lastLoginAt: new Date()
          });
        }
      });
    }
  }
  
  logout() {
    return this.afAuth.signOut();
  }
}