import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import {NavController} from "@ionic/angular";

@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private navCtrl: NavController
  ) {}

  async initPush() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('PushNotifications not is available on the web.');
      return;
    }

    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }

    await PushNotifications.register();

    await PushNotifications.addListener('registration', async (token) => {
      console.log('Token FCM received:', token.value);
      const user = this.auth.currentUser;
      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        await updateDoc(userRef, {token: token.value});
      } else {
        localStorage.setItem('fcm', token.value);
      }
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Error registering FCM:', err);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification received :', JSON.stringify(notification));

      const meetingId = notification.data?.meetingId;
      const name = notification.data?.name;
      const user = this.auth.currentUser;

      if (user != null) {
        if (meetingId && name) {
          this.navCtrl.navigateForward(['/incoming-call'], {
            state: {
              meetingId: meetingId,
              callerName: name
            }
          });
        }
      }
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      console.log('➡️ Action in local notification:', event);

      const meetingId = event.notification?.extra?.meetingId;
      const callerName = event.notification?.extra?.callerName;

      if (meetingId && callerName) {
        console.log('📲 Back to call');

        this.navCtrl.navigateForward(['/incoming-call'], {
          state: {
            meetingId: meetingId,
            callerName: callerName
          }
        });
      }
    });
  }
}
