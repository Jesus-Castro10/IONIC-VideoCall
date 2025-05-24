import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat.service';
import { Message } from 'src/app/interfaces/message';
import { ActivatedRoute } from '@angular/router';
import { FileService } from 'src/app/shared/services/file.service';
import { BucketService } from 'src/app/core/services/bucket.service';
import { GeolocationService } from 'src/app/shared/services/geolocation.service';

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
  chatId: string = '';
  otherUserId!: string;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private fileService: FileService,
    private bucketSrv: BucketService,
    private geoService: GeolocationService
  ) {}

  ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('id')!;
    this.currentUserId = localStorage.getItem('user_id') || '';
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

    this.chatService.sendMessage(this.chatId, message);
    this.newMessage = '';
  }

  async selectFile() {
    const file = await this.fileService.pickFile();
    if (file) {
      console.log('JITCALL : Archivo seleccionado:', JSON.stringify(file));
      console.log('JITCALL : seleccionado:', JSON.stringify(file.blob));
      const url = await this.bucketSrv.uploadFile(
        file.blob || new Blob(),
        `${this.currentUserId}`
      );
      console.log('JITCALL : URL del archivo subido:', url);
    } else {
      console.log('No se seleccionó archivo');
    }
  }

  async getLocation() {
    try {
      const location = await this.geoService.getCurrentLocation();
      console.log('Ubicación actual:', location);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }
}
