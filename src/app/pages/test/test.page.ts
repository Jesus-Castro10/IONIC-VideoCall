import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../../core/services/notification.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: false
})
export class TestPage implements OnInit {

  constructor(private notificationService: NotificationService) {

  }

  async ngOnInit() {
    await this.send()
  }

  async send() {
    const token = "dPIKR0RlRV6B3u06CKKIbI:APA91bG1DL3J3hX6eviyPXrnaTS-EOFKgqdbLxzk-3KJxqiMV710fQTeOT-ZKgl1V1ODm9svUNUKEbNUXuQUZvqpuTedyrUMynBvIaexPG4Of9S8FKxkeIo";
    const meetingId = "sala_123";
    const userFrom = "yk96KDr8nSgrcoySjhAfSmuJDTe2";
    await this.notificationService.sendNotification(meetingId, "Jesus", userFrom);
  }

}
