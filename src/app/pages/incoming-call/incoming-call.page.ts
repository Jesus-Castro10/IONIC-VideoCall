import { Component, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
  standalone: false
})
export class IncomingCallPage implements OnDestroy {

  meetingId: string = '';
  callerName: string = '';

  private callEndedListener: any;
  private backButtonListener: any;

  constructor(
    private navCtrl: NavController,
    private platform: Platform
  ) {}

  ionViewWillEnter() {
    const navigation = history.state;
    this.meetingId = navigation.meetingId || '';
    this.callerName = navigation.callerName || 'Llamada entrante';

    this.listenForCallEnded();
    this.startListeningBackButton();
  }

  async acceptCall() {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('Esta función solo está disponible en Android.');
      return;
    }

    try {
      console.log('🚀 Aceptando llamada:', this.meetingId, this.callerName);
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId: this.meetingId,
        userName: this.callerName
      });
    } catch (error) {
      console.error('❌ Error al lanzar la llamada:', error);
    }
  }

  async rejectCall() {
    console.log('❌ Rechazando llamada...');
    await this.navCtrl.navigateRoot('/home');
    // Aquí podrías notificar al servidor que rechazó si quieres
  }

  private listenForCallEnded() {
    if ((window as any).Capacitor?.Plugins?.MyCustomPlugin) {
      console.log('📞 Escuchando evento callEnded...');
      this.callEndedListener = (window as any).Capacitor.Plugins.MyCustomPlugin.addListener('callEnded', async () => {
        console.log('📞 Llamada finalizada, regresando al Home');
        await this.navCtrl.navigateRoot('/home');
      });
    } else {
      console.error('❌ Plugin MyCustomPlugin no disponible.');
    }
  }

  private startListeningBackButton() {
    this.backButtonListener = this.platform.backButton.subscribeWithPriority(10, async () => {
      console.log('↩️ Usuario presionó botón atrás durante llamada entrante');

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: '📞 Llamada entrante perdida',
            body: `${this.callerName} intentó llamarte`,
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

      await this.navCtrl.navigateRoot('/home');
    });
  }

  ngOnDestroy() {
    console.log('🧹 Limpiando listeners en IncomingCallPage');

    if (this.callEndedListener) {
      this.callEndedListener.remove();
    }

    if (this.backButtonListener) {
      this.backButtonListener.unsubscribe();
    }
  }
}
