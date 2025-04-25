import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from '@angular/fire/firestore';
import { from } from 'rxjs';
import { CollectionReference, DocumentData } from 'firebase/firestore';
import { Contact } from '../../interfaces/contact';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../../interfaces/user';
import {ToastService} from "../../shared/services/toast.service";
import {ContactDto} from "../../interfaces/contact-dto";

@Injectable({ providedIn: 'root' })
export class ContactService {

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private toastService: ToastService,) {
  }

  private contactsSubject = new BehaviorSubject<ContactDto[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  private getContactsCollectionRef(uid: string): CollectionReference<DocumentData> {
    return collection(this.firestore, `users/${uid}/contacts`);
  }

  async create(uid: string, phone: string, nickname: string) {
    const user = await this.userService.findUserByPhoneNumber(phone);
    if (user === null) {
      await this.toastService.presentToast("User doesn't exist",'danger');
      return;
    }
    const contact = { user_uid: user.uid, nickname: nickname };
    const colRef = this.getContactsCollectionRef(uid);
    await addDoc(colRef, contact);
    await this.loadAll(uid);
  }

  async loadAll(uid: string): Promise<void> {
    const contactRef = this.getContactsCollectionRef(uid);
    const contactSnapshots = await getDocs(contactRef);

    const results: ContactDto[] = [];

    for (const docSnap of contactSnapshots.docs) {
      const contactUid = docSnap.data()['user_uid'];
      const userRef = doc(this.firestore, `users/${contactUid}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const contactDTO: ContactDto = {
          uid: docSnap.id,
          user: {
            uid: userSnap.id,
            ...userData
          } as User
        };
        results.push(contactDTO);
      }
    }

    this.contactsSubject.next(results);
  }

  get(uid: string, contactId: string): Observable<ContactDto | undefined> {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    return from(this.buildContactDto(contactRef));
  }

  private async buildContactDto(contactRef: any): Promise<ContactDto | undefined> {
    const contactSnap = await getDoc(contactRef);
    if (!contactSnap.exists()) {
      return undefined;
    }

    const contactData = contactSnap.data() as { [key: string]: any };
    const userUid = contactData['user_uid'];

    const userRef = doc(this.firestore, `users/${userUid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return undefined;
    }

    const userData = userSnap.data();
    return {
      uid: contactSnap.id,
      nickname: contactData['nickname'],
      user: {
        uid: userSnap.id,
        ...userData
      } as User
    };
  }

  async update(uid: string, contactId: string, data: Partial<Contact>) {
    const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
    await updateDoc(contactRef, data);
    await this.loadAll(uid);
  }

  async delete(uid: string, contactId: string) {
    try {
      const contactRef = doc(this.firestore, `users/${uid}/contacts/${contactId}`);
      const snapshot = await getDoc(contactRef);

      if (!snapshot.exists()) {
        console.log('El contacto no existe.');
        return;
      }

      await deleteDoc(contactRef);
      console.log('Contacto eliminado exitosamente.');
    } catch (error) {
      console.error('Error eliminando contacto:', error);
    }
  }


}
