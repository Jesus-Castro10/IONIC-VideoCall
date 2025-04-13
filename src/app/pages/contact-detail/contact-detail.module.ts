import {NgModule} from '@angular/core';

import { ContactDetailPageRoutingModule } from './contact-detail-routing.module';

import { ContactDetailPage } from './contact-detail.page';
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    ContactDetailPageRoutingModule
  ],
  declarations: [ContactDetailPage]
})
export class ContactDetailPageModule {

}
