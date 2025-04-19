import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
  Auth, sendPasswordResetEmail
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  async register(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
      console.log('Verification email sent');
    }
    return userCredential.user;
  }

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  logout(){
    return this.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;

    if (user) {
      return user;
    } else {
      return new Promise((resolve) => {
        const unsubscribe = this.auth.onAuthStateChanged(currentUser => {
          unsubscribe();
          resolve(currentUser);
        });
      });
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
    console.log('Password reset email sent');
  }
}
