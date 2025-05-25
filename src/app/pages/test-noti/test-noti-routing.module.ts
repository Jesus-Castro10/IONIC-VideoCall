import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestNotiPage } from './test-noti.page';

const routes: Routes = [
  {
    path: '',
    component: TestNotiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestNotiPageRoutingModule {}
