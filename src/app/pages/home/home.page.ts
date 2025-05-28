import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { ContactService } from '../../core/services/contact.service';
import { Contact } from '../../interfaces/contact';
import { Router } from '@angular/router';
import { LoaderService } from '../../shared/services/loader.service';
import { AuthService } from '../../core/services/auth-service.service';
import { ModalService } from '../../shared/services/modal.service';
import { User } from '../../interfaces/user';
import { CallService } from '../../core/services/call.service';
import {ContactDto} from "../../interfaces/contact-dto";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  contacts: ContactDto[] = [];
  filteredContacts: ContactDto[] = [];
  uid!: string;
  searchTerm: string = '';

  constructor(
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
    this.contactService.contacts$.subscribe(contacts => {
      this.contacts = contacts;
      this.filterContacts();
    });
    await this.loadContacts();
  }

  async loadContacts() {
    await this.loaderService.show('Loading contacts...');
    await this.contactService.loadAll(this.uid);
    await this.loaderService.hide();
  }

  async goToDetail(id: any) {
    await this.router.navigate(['/contact-detail/' + id]);
  }

  async callContact(phone: any) {
    await this.callService.joinCall(phone);
  }

  async goChat(id: any) {
    await this.router.navigate(['/chat/' + id]);
  }

  filterContacts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredContacts = this.contacts.filter(contact =>
      contact.user.name.toLowerCase().includes(term)
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.filterContacts();
  }
}
