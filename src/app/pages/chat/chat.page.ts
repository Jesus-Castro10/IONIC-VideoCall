import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat.service';
import { Message } from 'src/app/interfaces/message';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
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
}
