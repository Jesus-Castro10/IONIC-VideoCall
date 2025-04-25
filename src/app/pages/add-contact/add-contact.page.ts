import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController} from "@ionic/angular";
import {AuthService} from "../../core/services/auth-service.service";
import {ContactService} from "../../core/services/contact.service";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false,
})
export class AddContactPage {

  email: string = '';
  avatarPreview: string | undefined;
  uid: string = '';

  form!: FormGroup;

  constructor(private navCtrl: NavController,
              private fb: FormBuilder,
              private authService: AuthService,
              private contactService: ContactService,
              private loaderService: LoaderService,) {
    this.form = this.fb.group({
      nickname: ['', Validators.minLength(3)],
      phone: ['', [Validators.minLength(7), Validators.required]]
    });

    this.authService.getCurrentUser().then(value => {
      this.uid = value?.uid || '';
    });
  }

  async save() {
    console.log('Form : ', this.form.value);
    const contact = this.form.value;
    await this.loaderService.show("Saving contact...")
    await this.contactService.create(this.uid,contact.phone,contact.nickname).then(() => {
      this.loaderService.hide();
      this.navCtrl.back();
    })
  }

  cancelar() {
    this.navCtrl.back();
  }

}
