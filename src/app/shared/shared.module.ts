import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactFormComponent} from "./components/contact-form/contact-form.component";
import {LoaderService} from "./services/loader.service";
import {HeaderComponent} from "./components/header/header.component";

const EXPORTS = [CommonModule, IonicModule, ReactiveFormsModule, FormsModule];
const COMPONENTS = [ContactFormComponent, HeaderComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...EXPORTS,
  ],
  exports: [...EXPORTS,...COMPONENTS],
  providers: [LoaderService]
})
export class SharedModule { }
