import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {LoaderService} from "../../services/loader.service";
import {AuthService} from "../../../core/services/auth-service.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false,
})
export class FooterComponent {

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
  ) { }

  async logout() {
    await this.loaderService.show('Closing session');
    await this.authService.logout();
    await this.loaderService.hide().then(() => this.router.navigate(['/login']));
  }

  async goToAddContact() {
    await this.router.navigate(['/add-contact']);
  }

  async goProfile(){
    await this.router.navigate(['/profile']);
  }

}
