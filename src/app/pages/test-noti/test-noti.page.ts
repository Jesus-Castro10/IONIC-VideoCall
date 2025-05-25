import { Component, OnInit } from '@angular/core';
import { CallService } from 'src/app/core/services/call.service';

@Component({
  selector: 'app-test-noti',
  templateUrl: './test-noti.page.html',
  styleUrls: ['./test-noti.page.scss'],
  standalone: false
})
export class TestNotiPage implements OnInit {

  constructor(private callService: CallService) { }

  ngOnInit() {
  }

  call() {
    this.callService.joinCall('3106137192');
  }
}
