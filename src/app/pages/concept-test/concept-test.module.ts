import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConceptTestPageRoutingModule } from './concept-test-routing.module';

import { ConceptTestPage } from './concept-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConceptTestPageRoutingModule
  ],
  declarations: [ConceptTestPage]
})
export class ConceptTestPageModule {}
