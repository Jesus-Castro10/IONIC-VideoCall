import { NgModule } from '@angular/core';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [SharedModule, ChatPageRoutingModule],
  declarations: [ChatPage],
})
export class ChatPageModule {}
