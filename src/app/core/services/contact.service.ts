import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  docData,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Contact } from '../../interfaces/contact';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../../interfaces/user';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);

  private contactsSubject = new BehaviorSubject<User[]>([]);
  contacts$ = this.contactsSubject.asObservable(); // 👉 para suscribirse desde HomePage o donde sea

  private getContactsCollectionRef(uid: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async create(uid: string, phone: string) {
    const user = await this.userService.findUserByPhoneNumber(phone);
    if (user === null) {
      console.log('Es nulo');
      return;
    }
    const contact = { user_uid: user.uid };
    const colRef = this.getContactsCollectionRef(uid);
    await addDoc(colRef, contact);
    await this.loadAll(uid); // 👉 después de crear, recargar contactos
  }

  async loadAll(uid: string): Promise<void> {
    const contactRef = this.getContactsCollectionRef(uid);
    const contactSnapshots = await getDocs(contactRef);

    const results: User[] = [];

    for (const docSnap of contactSnapshots.docs) {
      const contactUid = docSnap.data()['user_uid'];
      const userRef = doc(this.firestore, `users/${contactUid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        results.push({ uid: userSnap.id, ...userSnap.data() } as User);
      }
    }

    this.contactsSubject.next(results); // 👉 Actualizamos el estado reactivo
  }

  get(uid: string, contactId: string): Observable<Contact | undefined> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return docData(contactRef, { idField: 'uid' }) as Observable<Contact | undefined>;
  }

  async update(uid: string, contactId: string, data: Partial<Contact>) {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    await updateDoc(contactRef, data);
    await this.loadAll(uid); // 👉 después de actualizar, recargar
  }

  async delete(uid: string, contactId: string) {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    console.log(contactRef);
    await deleteDoc(contactRef);
    await this.loadAll(uid); // 👉 después de eliminar, recargar
  }
}
