import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastColor = 'success' | 'warning' | 'danger' | 'primary' | 'medium' | 'tertiary';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message: string, type: ToastColor) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      color: type,
      position: 'top',
    });

    await toast.present();
  }
}
