import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {User} from "../../interfaces/user";

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  async create(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid);
    await setDoc(userRef, user);
  }

  async get(uid: string): Promise<User | null> {
    const userRef = doc(this.firestore, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as User) : null;
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
}
