import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestAudioPage } from './test-audio.page';

const routes: Routes = [
  {
    path: '',
    component: TestAudioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestAudioPageRoutingModule {}
