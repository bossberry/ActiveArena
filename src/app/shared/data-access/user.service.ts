import { Injectable, inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, from, filter } from 'rxjs';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersCollection = 'users';
  fireStore = inject(AngularFirestore);

  getUserDocRef(userId: string): AngularFirestoreDocument<User> {
    return this.fireStore.collection<User>(this.usersCollection).doc(userId);
  }

  getUser(userId: string): Observable<User> {
    return this.fireStore.collection<User>(this.usersCollection).doc(userId).valueChanges().pipe(
      filter((user): user is User => !!user)
    );
  }

  addUser(user: User): Observable<void> {
    return from(this.fireStore.collection(this.usersCollection).doc(user.uid).set(user));
  }

  updateUser(userId: string, user: Partial<User>): Observable<void> {
    return from(this.fireStore.collection(this.usersCollection).doc(userId).update(user));
  }

  deleteUser(userId: string): Observable<void> {
    return from(this.fireStore.collection(this.usersCollection).doc(userId).delete());
  }
}