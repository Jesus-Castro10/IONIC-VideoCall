import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ContactFormComponent} from "./components/contact-form/contact-form.component";
import {LoaderService} from "./services/loader.service";
import {HeaderComponent} from "./components/header/header.component";
import {ImgLoadComponent} from "./components/img-load/img-load.component";
import {InputComponent} from "./components/input/input.component";
import {ActionsButtonsComponent} from "./components/actions-buttons/actions-buttons.component";
import {FooterComponent} from "./components/footer/footer.component";
import { LocationComponent } from './components/location/location.component';

const EXPORTS = [CommonModule, IonicModule, ReactiveFormsModule, FormsModule];
const COMPONENTS = [ContactFormComponent, HeaderComponent, ImgLoadComponent, InputComponent, ActionsButtonsComponent, FooterComponent, LocationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    ...EXPORTS,
  ],
  exports: [...EXPORTS,...COMPONENTS],
  providers: [LoaderService]
})
export class SharedModule { }
