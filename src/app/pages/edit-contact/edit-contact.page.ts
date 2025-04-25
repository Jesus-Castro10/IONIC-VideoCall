import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController} from "@ionic/angular";
import {AuthService} from "../../core/services/auth-service.service";
import {ContactService} from "../../core/services/contact.service";
import {LoaderService} from "../../shared/services/loader.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactDto} from "../../interfaces/contact-dto";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
  standalone: false,
})
export class EditContactPage implements OnInit{

  form!: FormGroup;
  contactId: string = '';
  uid: string = '';
  contact!: ContactDto | undefined;

  constructor(private navCtrl: NavController,
              private fb: FormBuilder,
              private contactService: ContactService,
              private loaderService: LoaderService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,)
  {
    this.form = this.fb.group({
      nickname: ['', Validators.minLength(3)],
      phone: ['', [Validators.minLength(7), Validators.required]]
    });

    this.authService.getCurrentUser().then(value => {
      this.uid = value?.uid || '';
    });
  }

  async ngOnInit() {
    await this.loadContact();
  }

  async loadContact() {
    this.contactId = this.route.snapshot.paramMap.get('id')!;
    await this.loaderService.show();

    this.contactService.get(this.uid, this.contactId).subscribe({
      next: async (contact) => {
        this.form.patchValue({nickname: contact?.nickname, phone: contact?.user.phone});
        await this.loaderService.hide();
      },
      error: async (error) => {
        console.error('Error loading contact:', error);
      }
    });

  }

  async update() {
    console.log('Form : ', this.form.value);
    const contact = this.form.value;
    await this.loaderService.show("Updating contact...")
    await this.contactService.update(this.uid,contact.phone,contact.nickname).then(() => {
      this.loaderService.hide();
      this.navCtrl.back();
    })
  }

  cancel() {
    this.navCtrl.back();
  }
}
