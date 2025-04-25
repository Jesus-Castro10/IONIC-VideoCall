import { Injectable } from '@angular/core';
import {Capacitor, registerPlugin} from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

const MyCustomPlugin = registerPlugin<{
  addListener: (eventName: string, callback: (data: any) => void) => Promise<void>;
  resumePending: () => Promise<void>;
}>('MyCustomPlugin');

@Injectable({ providedIn: 'root' })
export class PushNotificationService {

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private navCtrl: NavController
  ) {}

  async refreshToken() {
    console.log("Refreshing token")
    if (Capacitor.getPlatform() === 'web') {
      console.warn('PushNotifications not available on web.');
      return;
    }

    await this.requestPermissions();
    await PushNotifications.register();

    await PushNotifications.addListener('registration', async (token) => {
      console.log('🔄 Token FCM received :', token.value);
      const user = this.auth.currentUser;

      if (user) {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as any;
          if (data.token !== token.value) {
            await updateDoc(userRef, { token: token.value });
            console.log('✅ Token updated in Firestore.');
          } else {
            console.log('ℹ️ Token unchanged, no update needed.');
          }
        }
      } else {
        localStorage.setItem('fcm', token.value);
        console.log("User not logged in, saving token in local storage")
      }
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('❌ Error registering for FCM:', err);
    });
  }

  async listenNotifications() {
    if (Capacitor.getPlatform() === 'web') {
      console.warn('PushNotifications not available on web.');
      return;
    }

    // await PushNotifications.addListener('pushNotificationReceived', (notification) => {
    //   console.log('📩 Push notification received:', JSON.stringify(notification));
    //
    //   const meetingId = notification.data?.meetingId;
    //   const name = notification.data?.name;
    //   const user = this.auth.currentUser;
    //
    //   if (user && meetingId && name) {
    //     this.navigateToIncomingCall(meetingId, name);
    //   }
    // });

    MyCustomPlugin.addListener?.('dummy', () => {});

    await MyCustomPlugin.addListener('pushNotificationReceived', (data) => {
      this.navigateToIncomingCall(data.meetingId, data.callerName);
    });

    await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      console.log('➡️ Local notification action performed:', event);

      const meetingId = event.notification?.extra?.meetingId;
      const callerName = event.notification?.extra?.callerName;

      if (meetingId && callerName) {
        console.log('📲 Navigating back to call');
        this.navigateToIncomingCall(meetingId, callerName);
      }
    });
  }

  private async requestPermissions() {
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== 'granted') {
      await PushNotifications.requestPermissions();
    }
  }

  async navigateToIncomingCall(meetingId: string, callerName: string) {
    await this.navCtrl.navigateForward(['/incoming-call'], {
      state: {
        meetingId,
        callerName
      }
    });
  }
}
