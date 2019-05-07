import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
import {
  AngularFirestore,
  DocumentReference,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
// User
import { Router } from '@angular/router';
import { Note } from '../models/note.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {

    this.currentUser = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          localStorage.removeItem('user');
          return of(null);
        }
      }),
      tap(user => localStorage.setItem('user', JSON.stringify(user)))
    );
  }

  // check if user is logged in
  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }

  // login
  login(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/customers']);
      })
      .catch(err => {
        window.alert(err.message);
      });
  }

  // logout
  logout() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
