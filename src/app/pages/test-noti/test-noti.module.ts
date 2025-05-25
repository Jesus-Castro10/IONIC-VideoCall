import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestNotiPageRoutingModule } from './test-noti-routing.module';

import { TestNotiPage } from './test-noti.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TestNotiPageRoutingModule
  ],
  declarations: [TestNotiPage]
})
export class TestNotiPageModule {}
