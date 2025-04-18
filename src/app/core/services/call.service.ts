import { Injectable } from '@angular/core';
import {NavController} from "@ionic/angular";
import {Capacitor} from "@capacitor/core";
import {UserService} from "./user.service";
import {ToastService} from "../../shared/services/toast.service";
import {AuthService} from "./auth-service.service";
import {NotificationService} from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private toastService: ToastService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) { }

  async acceptCall(meeting: string, name: string) {
    if (Capacitor.getPlatform() !== 'android') {
      console.warn('This function available Android.');
      return;
    }

    try {
      await (window as any).Capacitor.Plugins.MyCustomPlugin.startCall({
        meetingId: meeting,
        userName: name
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  async joinCall(phone: string) {
    const userToCall = await this.userService.findUserByPhoneNumber(phone);
    const userAuth = await this.authService.getCurrentUser()
    console.log("userToCall", userToCall);
    console.log("userAuth", userAuth);
    if (!userAuth || !userToCall) {
      await this.toastService.presentToast("Error to init call",'danger')
    }
    const meetingId = this.generateId();
    await this.launchCall(meetingId,userAuth?.displayName);
    // @ts-ignore
    await this.notificationService.sendNotification(meetingId,userAuth?.displayName,userToCall.uid)
  }

  generateId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    return Array.from({ length: 10 }, () =>
      characters[Math.floor(Math.random() * characters.length)]
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
        userName: name
      });
    } catch (error) {
      console.error('❌ Error to call :', error);
    }
  }

  async rejectCall() {
    await this.navCtrl.navigateRoot('/home');
  }
}
