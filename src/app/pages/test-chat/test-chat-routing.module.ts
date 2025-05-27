import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestChatPage } from './test-chat.page';

const routes: Routes = [
  {
    path: '',
    component: TestChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestChatPageRoutingModule {}
