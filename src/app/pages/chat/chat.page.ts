import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat.service';
import { Message } from 'src/app/interfaces/message';
import { ActivatedRoute } from '@angular/router';
import { FileService } from 'src/app/shared/services/file.service';
import { BucketService } from 'src/app/core/services/bucket.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { VoiceService } from 'src/app/shared/services/voice.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/core/services/user.service';
import { LocationComponent } from 'src/app/shared/components/location/location.component';
import { ModalController } from '@ionic/angular';

type typefile = 'text' | 'image' | 'audio' | 'location' | 'file';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false,
})
export class ChatPage implements OnInit {
  messages$: Observable<any[]> = of([]);
  newMessage: string = '';

  currentUserId!: string;
  otherUserId!: string;
  currentUser?: User;
  otherUser?: User;

  chatId: string = '';

  isRecording = false;
  audioBlobUrl: string | null = null;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private bucketSrv: BucketService,
    private geoService: GeolocationService,
    private cameraSrv: CameraService,
    private voiceSrv: VoiceService,
    private notiSrv: NotificationService,
    private userSrv: UserService,
    private modalCtrl: ModalController,
  ) {}

  async ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.currentUserId = localStorage.getItem('user_id') || '';
    this.currentUser = await this.userSrv.get(this.currentUserId);
    this.otherUser = await this.userSrv.get(this.otherUserId);

    this.chatService
      .createOrGetChat(this.currentUserId, this.otherUserId)
      .then((chatId) => {
        this.chatId = chatId;
        this.messages$ = this.chatService.listenToMessages(chatId);
      });
  }

  sendMessage() {
    const message: Message = {
      senderId: this.currentUserId,
      type: 'text',
      content: this.newMessage,
      timestamp: null,
    };

    this.chatService.sendMessage(this.chatId, message).then(() => {
      this.sendNotification();
    });
    this.newMessage = '';
  }

  sendOtherMessage(file: any, type: typefile) {
    const message: Message = {
      senderId: this.currentUserId,
      type: type,
      content: file,
      timestamp: null,
    };

    this.chatService.sendMessage(this.chatId, message);
  }

  async selectFile() {
    const file = await this.fileService.pickFile();
    if (file) {
      console.log('JITCALL : Archivo seleccionado:', JSON.stringify(file));
      console.log('JITCALL : seleccionado:', JSON.stringify(file.blob));
      this.bucketSrv
        .uploadFile(file.blob || new Blob(), `${this.currentUserId}`)
        .then((url) => {
          console.log('JITCALL : URL del archivo subido:', url);
          this.sendOtherMessage(url, 'file');
        })
        .catch((error) => {
          console.error('Error subiendo archivo:', error);
        });
    } else {
      console.log('No se seleccionó archivo');
    }
  }

  async getLocation() {
    try {
      this.geoService.getCurrentLocation().then((location) => {
        this.sendOtherMessage(location, 'location');
      });
      console.log('Ubicación actual:', location);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  sendPicture() {
    this.cameraSrv
      .pickPicture()
      .then((blob) => {
        const message: Message = {
          senderId: this.currentUserId,
          type: 'image',
          content: '',
          timestamp: null,
        };

        this.chatService.sendMessage(this.chatId, message);
        this.bucketSrv
          .uploadImage(blob, `${this.currentUserId}`)
          .then((url) => {
            console.log('JITCALL : URL de la imagen subida:', url);
            this.sendOtherMessage(url, 'image');
          })
          .catch((error) => {
            console.error('Error subiendo imagen:', error);
          });
      })
      .catch((error) => {
        console.error('Error al tomar la foto:', error);
      });
  }

  async toggleRecording() {
    try {
      if (!this.isRecording) {
        await this.voiceSrv.startRecording();
        this.isRecording = true;
        this.audioBlobUrl = null;
      } else {
        const { recordDataBase64, mimeType } = await this.voiceSrv.stopRecording();
        this.isRecording = false;
        console.log('JITCALL : Grabación detenida:', recordDataBase64);
        console.log('JITCALL : Tipo de audio:', mimeType);
        const blob = this.base64ToBlob(recordDataBase64, mimeType);
        this.audioBlobUrl = URL.createObjectURL(blob);
        if (blob) {
          this.bucketSrv
            .uploadAudio(blob, `${this.currentUserId} ${Date.now()}.aac`)
            .then((url) => {
              console.log('JITCALL : URL del audio subido:', url);
              this.sendOtherMessage(url, 'audio');
            })
            .catch((error) => {
              console.error('Error subiendo audio:', error);
            });
        }
      }
    } catch (error) {
      console.error('Error de grabación:', error);
      this.isRecording = false;
    }
  }

  base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, (c) => c.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  sendNotification() {
    console.log('JITCALL : Enviando notificación');
    this.notiSrv.sendNotification('message', {
      userSend: {
        uid: this.currentUserId,
        name: this.currentUser?.name || '',
      },
      userReceiver: {
        uid: this.otherUser?.uid || '',
        name: this.otherUser?.name || '',
        token: this.otherUser?.token || '',
      },
    });
  }

  async openMap(position: any) {
    const modal = await this.modalCtrl.create({
      component: LocationComponent,
      componentProps: {
        position: position,
      },
    });
    modal.present();
  }
}
