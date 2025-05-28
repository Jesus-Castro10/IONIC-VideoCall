import { Component, OnInit } from '@angular/core';
import { map, Observable, of } from 'rxjs';
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
import { CallService } from 'src/app/core/services/call.service';

type typefile = 'text' | 'image' | 'audio' | 'location' | 'file';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit {
  messages$: Observable<Message[]> = of([]);
  newMessage: string = '';
  currentUserId!: string;
  otherUserId!: string;
  currentUser?: User;
  otherUser?: User;
  chatId: string = '';
  isRecording = false;
  audioBlobUrl: string | null = null;
  showAttachments = false;

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
    private callSrv: CallService
  ) {}

  async ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.currentUserId = localStorage.getItem('user_id') || '';
    
    // Obtener información de los usuarios
    this.currentUser = await this.userSrv.get(this.currentUserId);
    this.otherUser = await this.userSrv.get(this.otherUserId);

    // Crear o obtener el chat
    this.chatService
      .createOrGetChat(this.currentUserId, this.otherUserId)
      .then((chatId) => {
        this.chatId = chatId;
        this.messages$ = this.chatService.listenToMessages(chatId).pipe(
  map(messages => messages.map(msg => ({
    ...msg,
    timestamp: this.convertTimestamp(msg.timestamp)
  })))
);
      });
  }

  // Métodos existentes con pequeñas adaptaciones para el diseño
  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message: Message = {
      senderId: this.currentUserId,
      type: 'text',
      content: this.newMessage,
      timestamp: new Date(),
    };

    this.chatService.sendMessage(this.chatId, message).then(() => {
      this.sendNotification();
      this.newMessage = '';
    });
  }

  sendOtherMessage(file: any, type: typefile) {
    const message: Message = {
      senderId: this.currentUserId,
      type: type,
      content: file,
      timestamp: new Date(),
    };

    this.chatService.sendMessage(this.chatId, message);
    this.sendNotification();
    this.showAttachments = false;
  }

  async selectFile() {
    const file = await this.fileService.pickFile();
    if (file) {
      this.bucketSrv
        .uploadFile(file.blob || new Blob(), `${this.currentUserId}`)
        .then((url) => {
          this.sendOtherMessage(url, 'file');
        })
        .catch(console.error);
    }
  }

  async getLocation() {
    try {
      const location = await this.geoService.getCurrentLocation();
      this.sendOtherMessage(location, 'location');
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  sendPicture() {
    this.cameraSrv.pickPicture()
      .then((blob) => {
        this.bucketSrv
          .uploadImage(blob, `${this.currentUserId}`)
          .then((url) => {
            this.sendOtherMessage(url, 'image');
          })
          .catch(console.error);
      })
      .catch(console.error);
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
        const blob = this.base64ToBlob(recordDataBase64, mimeType);
        this.audioBlobUrl = URL.createObjectURL(blob);
        
        if (blob) {
          this.bucketSrv
            .uploadAudio(blob, `${this.currentUserId} ${Date.now()}.aac`)
            .then((url) => {
              this.sendOtherMessage(url, 'audio');
            })
            .catch(console.error);
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
    if (!this.otherUser) return;
    
    this.notiSrv.sendNotification('message', {
      userSend: {
        uid: this.currentUserId,
        name: this.currentUser?.name || '',
      },
      userReceiver: {
        uid: this.otherUser.uid,
        name: this.otherUser.name,
        token: this.otherUser.token || '',
      },
    });
  }

  async openMap(position: any) {
    const modal = await this.modalCtrl.create({
      component: LocationComponent,
      componentProps: { position },
    });
    await modal.present();
  }

  toggleAttachmentOptions() {
    this.showAttachments = !this.showAttachments;
  }

  getUserAvatar(userId: string): string {
    return userId === this.currentUserId 
      ? this.currentUser?.image || 'assets/default-avatar.png'
      : this.otherUser?.image || 'assets/default-avatar.png';
  }

  // Nuevos métodos para el diseño
  startVoiceCall() {
    console.log('Iniciar llamada de voz');
    this.callSrv.joinCall(this.otherUser?.phone||"")
  }

  showUserInfo() {
    console.log('Mostrar información del usuario');
    // Implementar lógica para mostrar info
  }

  async openImageViewer(imageUrl: string) {
    // Implementar visualizador de imágenes
    console.log('Abrir imagen:', imageUrl);
  }

  private convertTimestamp(timestamp: any): Date {
  if (timestamp?.toDate) return timestamp.toDate();
  if (timestamp?.seconds) return new Date(timestamp.seconds * 1000);
  if (timestamp instanceof Date) return timestamp;
  return new Date();
}
}