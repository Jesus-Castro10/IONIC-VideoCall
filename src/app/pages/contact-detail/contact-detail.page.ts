import { Component, OnInit } from '@angular/core';
import {Contact} from "../../interfaces/contact";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactService} from "../../core/services/contact.service";
import {Auth} from "@angular/fire/auth";
import {ModalController} from "@ionic/angular";
import {ContactFormComponent} from "../../shared/components/contact-form/contact-form.component";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
  standalone: false
})
export class ContactDetailPage implements OnInit {

  contactId: string = '';
  uid: string = '';
  contact: Contact | undefined;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private modalCtrl: ModalController,
    private loaderService: LoaderService
  ) {}

  async ngOnInit() {
    await this.loadContact()
  }

  async loadContact() {
    this.contactId = this.route.snapshot.paramMap.get('id')!;
    await this.loaderService.show("Loading...");
    this.contactService.get("yk96KDr8nSgrcoySjhAfSmuJDTe2",this.contactId).subscribe(contact => {
      this.contact = contact;
      this.loaderService.hide();
    })
  }
  async openEditionModal() {
    const modal = await this.modalCtrl.create({
      component: ContactFormComponent,
      componentProps: {
        initialData: this.contact,
        action: 'editar',
        showDelete: true
      }
    });

    modal.onDidDismiss().then(async res => {
      if (res.data?.deleted) {
        await this.loaderService.show();
        await this.contactService.delete("yk96KDr8nSgrcoySjhAfSmuJDTe2", this.contactId);
        this.router.navigate(['/home']).then(() => this.loaderService.hide());
      } else if (res.data) {
        console.log(res.data);
        await this.contactService.update("yk96KDr8nSgrcoySjhAfSmuJDTe2", this.contactId, res.data);
      }
    });

    await modal.present();
  }

}
