import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth-service.service";
import {User} from "@angular/fire/auth";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit{

  user!: User | null

  constructor(private authService: AuthService) {

  }

  async ngOnInit() {
    await this.loadUser()
  }

  async loadUser() {
    this.authService.getCurrentUser().then(user => {
      this.user = user
    })
  }
}
