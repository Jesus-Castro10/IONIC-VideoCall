import { Component, OnInit } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { LoaderService } from '../../shared/services/loader.service';
import { ModalService } from '../../shared/services/modal.service';
import { AuthService } from '../../core/services/auth-service.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../interfaces/user';
import { firstValueFrom } from 'rxjs';
import {ContactDto} from "../../interfaces/contact-dto";
import {CallService} from "../../core/services/call.service";

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
  standalone: false
})
export class ContactDetailPage implements OnInit {
  contactId: string = '';
  uid: string = '';
  contact!: ContactDto | undefined;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
    private callService: CallService,
  ) {
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
        console.log(contact);
        this.contact = contact;
        await this.loaderService.hide();
      },
      error: async (error) => {
        console.error('Error loading contact:', error);
        await this.loaderService.hide();
      }
    });
  }

  async openEditionModal() {
    await this.router.navigate(['/edit-contact/' + this.contactId]);
  }

  isDeletedResponse(result: any): result is { deleted: true } {
    return result && result.deleted === true;
  }

  async call(phone: any){
    await this.callService.joinCall(phone)
  }
}
