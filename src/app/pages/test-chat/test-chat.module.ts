import { NgModule } from '@angular/core';

import { TestChatPageRoutingModule } from './test-chat-routing.module';

import { TestChatPage } from './test-chat.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TestChatPageRoutingModule
  ],
  declarations: [TestChatPage]
})
export class TestChatPageModule {}
