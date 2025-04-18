import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal} from "@ionic/angular";
import {ContactService} from "../../core/services/contact.service";
import {Contact} from "../../interfaces/contact";
import {Router} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";
import {AuthService} from "../../core/services/auth-service.service";
import {ModalService} from "../../shared/services/modal.service";
import {UserService} from "../../core/services/user.service";
import {User} from "../../interfaces/user";
import {CallService} from "../../core/services/call.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  contacts!: User[];
  uid!: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
    private modalService: ModalService,
    private callService: CallService,

  ) {
    this.authService.getCurrentUser().then(value => {
      this.uid = value?.uid || ''
    })
  }

  async ngOnInit() {
    await this.getContacts();
  }

  async getContacts(){
    await this.loaderService.show("Loading contacts...");
    this.contacts = await this.contactService.getAll(this.uid)
    console.log("contacts", this.contacts)
    await this.loaderService.hide()
  }

  async openCreateModal() {
    const result = await this.modalService.openModal({ action: 'create' });

    if (result) {
      const contact = result as Contact;
      await this.contactService.create(this.uid, contact.phone);
    }
  }

  async goToDetail(id: any){
    await this.router.navigate(['/contact-detail/' + id]);
  }

  async logout(){
    await this.loaderService.show("Closing session");
    await this.authService.logout()
    await this.loaderService.hide().then(
      () => this.router.navigate(['/login'])
    )
  }

  async callContact(phone:any){
    await this.callService.joinCall(phone);
  }
}
