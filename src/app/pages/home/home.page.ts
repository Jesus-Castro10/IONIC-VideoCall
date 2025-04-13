import {Component, OnInit, ViewChild} from '@angular/core';
import {IonModal} from "@ionic/angular";
import {ContactService} from "../../core/services/contact.service";
import {Contact} from "../../interfaces/contact";
import {ContactFormComponent} from "../../shared/components/contact-form/contact-form.component";
import {ModalController} from "@ionic/angular";
import {UserService} from "../../core/services/user.service";
import {Router} from "@angular/router";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  contacts!: Contact[];
  uid: string;

  constructor(
    private contactService: ContactService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private router: Router,
    private loaderService: LoaderService,
  ) {
    this.uid = userService.getCurrentUser()?.uid || ''
    console.log("user service " + userService.getCurrentUser())
  }

  ngOnInit() {
    this.getContacts();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null,'confirm');
  }

  async getContacts(){
    await this.loaderService.show("Loading contacts...");
    this.contactService.getAll("yk96KDr8nSgrcoySjhAfSmuJDTe2").subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.loaderService.hide()
    })
  }

  async openCreateModal() {
    const modal = await this.modalCtrl.create({
      component: ContactFormComponent,
      componentProps: {
        action: 'crear'
      }
    });

    modal.onDidDismiss().then(async (res) => {
      const data = res.data;
      if (data) {
        await this.contactService.create("yk96KDr8nSgrcoySjhAfSmuJDTe2", data);
        // await this.contactService.create(this.uid, data);
        console.log(data);
      }
    });

    await modal.present();
  }

  goToDetail(id: any){
    this.router.navigate(['/contact-detail/' + id]);
  }
}
