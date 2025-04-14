import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ContactFormComponent} from "../components/contact-form/contact-form.component";
import {Contact} from "../../interfaces/contact";


@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private modalCtrl: ModalController) {}

  async openModal(options: {
    action: 'create' | 'update' | 'read',
    data?: Contact,
    showDelete?: boolean
  }): Promise<Contact | { deleted: true } | null> {
    const modal = await this.modalCtrl.create({
      component: ContactFormComponent,
      componentProps: {
        initialData: options.data,
        action: options.action,
        showDelete: options.showDelete ?? false
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    return data ?? null;
  }
}
