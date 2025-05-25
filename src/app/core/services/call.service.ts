import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { UserService } from './user.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from './auth-service.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async acceptCall(meeting: string, name: string) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }

    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId: meeting,
        userName: name,
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  // async joinCall(phone: string) {
  //   const userRecivier = await this.userService.findUserByPhoneNumber(phone);
  //   const uidCurrent = await this.authService.getCurrentUser()
  //   const userSend = await this.userService.get(uidCurrent?.uid)
  //   // console.log("userToCall", JSON.stringify(userRecivier));

  //   if (!userSend || !userRecivier) {
  //     await this.toastService.presentToast("Error to init call",'danger')
  //   }
  //   const meetingId = this.generateId();
  //   this.launchCall(meetingId,userSend?.name).then(() => {
  //     // @ts-ignore
  //     this.notificationService.sendNotification(meetingId,userSend,userRecivier)
  //   });
  // }

  async joinCall(phone: string) {
    const userRecivier = await this.userService.findUserByPhoneNumber(phone);
    const uidCurrent = await this.authService.getCurrentUser();
    const userSend = await this.userService.get(uidCurrent?.uid);

    if (!userSend || !userRecivier) {
      await this.toastService.presentToast('Error to init call', 'danger');
      return;
    }

    const meetingId = this.generateId();

    this.launchCall(meetingId, userSend.name).then(() => {
      this.notificationService.sendNotification('incoming_call', {
        meetingId,
        userSend: {
          uid: userSend.uid,
          name: userSend.name,
        },
        userReceiver: {
          uid: userRecivier.uid,
          name: userRecivier.name,
          token: userRecivier.token,
        },
      });
    });
  }

  generateId(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+-=|;:,.';
    return Array.from(
      { length: 10 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join('');
  }

  async launchCall(meeting: string, name: string | null | undefined) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }
    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId: meeting,
        userName: name,
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  async rejectCall() {
    await this.navCtrl.navigateRoot('/home');
  }
}
