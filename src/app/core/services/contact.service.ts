import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import {Contact} from "../../interfaces/contact";
import {Observable} from "rxjs";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);

  private getContactsCollectionRef(uid: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async create(uid: string, contact: Contact) {
    const colRef = this.getContactsCollectionRef(uid);
    return await addDoc(colRef, contact);
  }

  getAll(uid: string): Observable<Contact[]> {
    const colRef = this.getContactsCollectionRef(uid);
    return collectionData(colRef, { idField: 'uid' }) as Observable<Contact[]>;
  }

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
