import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const EXPORTS = [CommonModule, IonicModule, ReactiveFormsModule, FormsModule];

@NgModule({
  declarations: [],
  imports: [
    ...EXPORTS,
  ],
  exports: [...EXPORTS]
})
export class SharedModule { }
