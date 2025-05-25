import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  collectionData,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/message';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private firestore: Firestore,
    private notiSrv: NotificationService
  ) {}

  generateChatId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('_');
  }

  async createOrGetChat(userId1: string, userId2: string): Promise<string> {
    const chatId = this.generateChatId(userId1, userId2);
    const chatRef = doc(this.firestore, `chats/${chatId}`);
    const snapshot = await getDoc(chatRef);

    if (!snapshot.exists()) {
      await setDoc(chatRef, {
        users: [userId1, userId2],
        lastMessage: '',
        updatedAt: serverTimestamp(),
      });
    }

    return chatId;
  }

  listenToMessages(chatId: string): Observable<Message[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }

  async sendMessage(chatId: string, message: Message): Promise<void> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);
    await addDoc(messagesRef, {
      ...message,
      timestamp: serverTimestamp(),
    });

    const chatRef = doc(this.firestore, `chats/${chatId}`);
    await setDoc(
      chatRef,
      {
        lastMessage: message.type === 'text' ? message.content : message.type,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
