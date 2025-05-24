import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestAudioPageRoutingModule } from './test-audio-routing.module';

import { TestAudioPage } from './test-audio.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TestAudioPageRoutingModule
  ],
  declarations: [TestAudioPage]
})
export class TestAudioPageModule {}
