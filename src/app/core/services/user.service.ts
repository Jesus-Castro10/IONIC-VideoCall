import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query, where
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {User} from "../../interfaces/user";
import {Auth} from "@angular/fire/auth";

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private auth = inject(Auth)

  async create(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, user);
  }

  async get(uid: string): Promise<User | undefined> {
    const userRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as User) : undefined;
  }

  async update(uid: string, data: Partial<Omit<User, 'uid' | 'email'>>) {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, data);
  }

  async delete(uid: string) {
    const userRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userRef);
  }

  async getAll(): Promise<User[]> {
    const colRef = collection(this.firestore, 'users');
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as User);
  }

  async findUserByPhoneNumber(phone: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('phone', '==', Number(phone)));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, ...doc.data() } as User;
    }
    return null;
  }

  async addUserToken(user: any, token: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await updateDoc(userRef, {token: token});
  }
}
