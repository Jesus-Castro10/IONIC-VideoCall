import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomingCallPageRoutingModule } from './incoming-call-routing.module';

import { IncomingCallPage } from './incoming-call.page';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    IncomingCallPageRoutingModule
  ],
  declarations: [IncomingCallPage]
})
export class IncomingCallPageModule {}
