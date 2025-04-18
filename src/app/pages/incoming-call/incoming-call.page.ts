import {Component, OnDestroy} from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";
import {App} from "@capacitor/app";
import {LocalNotifications} from "@capacitor/local-notifications";

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
  standalone: false
})
export class IncomingCallPage implements OnDestroy{

  meetingId: string = '';
  callerName: string = '';
  private listener: any;
  private backButtonListener: any;

  constructor(private navCtrl: NavController, private platform: Platform) {}

  ionViewWillEnter() {
    const navigation = history.state;
    this.meetingId = navigation.meetingId || '';
    this.callerName = navigation.callerName || 'Llamada entrante';
    this.startListeningBackButton();
  }

  async rejectCall() {
    await this.navCtrl.navigateRoot('/home');
    //Enviar notificacion para que cancele todo
  }

  async acceptCall() {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Esta función solo está disponible en Android.');
      return;
    }

    try {
      const result = await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({ meetingId: this.meetingId, userName: this.callerName });
      console.log('Lanzamiento exitoso:', result);
    } catch (error) {
      console.error('Error al lanzar la llamada:', error);
    }
  }

  startListeningAppState() {
    this.listener = App.addListener('appStateChange', (state) => {
      console.log('🌀 AppState changed:', state);

      if (state.isActive) {
        console.log('📲 Volvió del plugin. Redirigiendo al Home.');
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

  startListeningBackButton() {
    this.backButtonListener = this.platform.backButton.subscribeWithPriority(10, async () => {
      console.log('↩️ Usuario presionó atrás en llamada entrante');

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: '📞 Llamada entrante',
            body: `${this.callerName} te está llamando`,
            schedule: { at: new Date(Date.now() + 100) },
            actionTypeId: 'CALL_REMINDER',
            extra: {
              meetingId: this.meetingId,
              callerName: this.callerName
            },
            sound: 'default',
          }
        ]
      });

      // Ir al Home
      this.navCtrl.navigateRoot('/home');
    });
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}
