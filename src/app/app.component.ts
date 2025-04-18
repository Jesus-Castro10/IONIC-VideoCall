import { Component } from '@angular/core';
import {PushNotificationService} from "./core/services/push-notification.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private notificationService: PushNotificationService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.notificationService.initPush();
  }
}
