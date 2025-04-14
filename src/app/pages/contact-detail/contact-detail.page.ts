import { Component, OnInit } from '@angular/core';
import {Contact} from "../../interfaces/contact";
import {ActivatedRoute, Router} from "@angular/router";
import {ContactService} from "../../core/services/contact.service";
import {LoaderService} from "../../shared/services/loader.service";
import {ModalService} from "../../shared/services/modal.service";
import {AuthService} from "../../core/services/auth-service.service";

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
    private loaderService: LoaderService,
    private modalService: ModalService,
    private authService: AuthService,
  ) {
    this.authService.getCurrentUser().then(value => {
      this.uid = value?.uid || ''
    })
  }

  async ngOnInit() {
    await this.loadContact()
  }

  async loadContact() {
    this.contactId = this.route.snapshot.paramMap.get('id')!;
    await this.loaderService.show();
    this.contactService.get(this.uid,this.contactId).subscribe(contact => {
      this.contact = contact;
      this.loaderService.hide();
    })
  }

  async openEditionModal() {
    const result = await this.modalService.openModal({
      action: 'update',
      data: this.contact,
      showDelete: true
    });
    await this.loaderService.show();
    if (this.isDeletedResponse(result)) {
      await this.contactService.delete(this.uid, this.contactId);
    } else if (result) {
      await this.contactService.update(this.uid, this.contactId, result);
    }
    await this.router.navigate(['/home']);
    await this.loaderService.hide();
  }

  isDeletedResponse(result: any): result is { deleted: true } {
    return result && result.deleted === true;
  }
}
