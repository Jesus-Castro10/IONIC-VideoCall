import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-test-chat',
  templateUrl: './test-chat.page.html',
  styleUrls: ['./test-chat.page.scss'],
  standalone: false
})
export class TestChatPage  {

  messageText: string = '';

  constructor(private actionSheetCtrl: ActionSheetController) {}

  sendMessage() {
    if (!this.messageText.trim()) return;
    console.log('Mensaje enviado:', this.messageText);
    this.messageText = '';
  }

  async showAttachmentOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Enviar...',
      buttons: [
        {
          text: 'Documento',
          icon: 'document-outline',
          handler: () => console.log('Documento seleccionado'),
        },
        {
          text: 'Foto',
          icon: 'image-outline',
          handler: () => console.log('Foto seleccionada'),
        },
        {
          text: 'Video',
          icon: 'videocam-outline',
          handler: () => console.log('Video seleccionado'),
        },
        {
          text: 'Ubicación',
          icon: 'location-outline',
          handler: () => console.log('Ubicación seleccionada'),
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

}
