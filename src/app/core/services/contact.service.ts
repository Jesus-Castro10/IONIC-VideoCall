import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  docData,
  updateDoc,
  deleteDoc, getDocs, getDoc,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import {Contact} from "../../interfaces/contact";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {User} from "../../interfaces/user";

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);

  private getContactsCollectionRef(uid: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async create(uid: string, phone: string) {
    const user = await this.userService.findUserByPhoneNumber(phone)
    if (user === null) {
      console.log("Es nulo")
      return;
    }
    const contact = {user_uid : user.uid}
    const colRef = this.getContactsCollectionRef(uid);
    return await addDoc(colRef, contact);
  }

  getAll(uid: string): Observable<Contact[]> {
    const colRef = this.getContactsCollectionRef(uid);
    return collectionData(colRef, { idField: 'uid' }) as Observable<Contact[]>;
  }

  // async getAll(uid: string): Promise<User[]> {
  //   const contactRef = collection(this.firestore, `users/${uid}/contacts`);
  //   const contactSnapshots = await getDocs(contactRef);
  //
  //   const results: User[] = [];
  //
  //   for (const docSnap of contactSnapshots.docs) {
  //     console.log("docSnap", docSnap);
  //     const contactUid = docSnap.data()['uid'];
  //     const userRef = doc(this.firestore, `users/${contactUid}`);
  //     const userSnap = await getDoc(userRef);
  //     if (userSnap.exists()) {
  //       results.push({ uid: userSnap.id, ...userSnap.data() } as User);
  //     }
  //   }
  //
  //   return results;
  // }

  get(uid: string, contactId: string): Observable<Contact | undefined> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return docData(contactRef, { idField: 'uid' }) as Observable<Contact | undefined>;
  }

  async update(uid: string, contactId: string, data: Partial<Contact>) {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return await updateDoc(contactRef, data);
  }

  async delete(uid: string, contactId: string) {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return await deleteDoc(contactRef);
  }
}
