import { Component, OnDestroy } from '@angular/core';
import {CallService} from "../../core/services/call.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-incoming-call',
  templateUrl: './incoming-call.page.html',
  styleUrls: ['./incoming-call.page.scss'],
  standalone: false
})
export class IncomingCallPage {

  meetingId: string = '';
  name: string = '';
  callername: string = '';

  constructor(
    private callService: CallService,
    private router: Router,
    ) {}

  ionViewWillEnter() {
    const navigation = history.state;
    this.meetingId = navigation.meetingId || '';
    this.callername = navigation.callerName || 'Incoming call';
    this.name = "Jose Jose";
  }

  async acceptCall() {
    this.callService.acceptCall(this.meetingId,this.name).then(() => this.router.navigate(['/home']));
  }

  async rejectCall() {
    await this.callService.rejectCall()
  }

}
