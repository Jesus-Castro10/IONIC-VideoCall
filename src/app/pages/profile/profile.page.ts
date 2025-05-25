import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/services/auth-service.service";
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit{

  user!: User | undefined;

  constructor(private authService: AuthService, private userService: UserService) {
  }

  async ngOnInit() {
    await this.loadUser()
  }

  async loadUser() {
    const uid = await this.authService.getCurrentUser().then(user => user?.uid);
    this.user = await this.userService.get(uid);
  }
}
