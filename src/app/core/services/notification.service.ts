import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async initPush() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('PushNotifications no está implementado en web.');
      return;
    }

    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }

    PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      console.log('📲 Token FCM recibido:', token.value);
      const user = this.auth.currentUser;
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(userRef, { token: token.value });
      }
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Error de registro FCM:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 Notificación recibida:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('➡️ Acción en la notificación:', notification);
    });
  }
}
