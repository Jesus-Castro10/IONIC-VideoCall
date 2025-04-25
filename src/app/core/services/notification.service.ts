import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {firstValueFrom} from "rxjs";
import {User} from "../../interfaces/user";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private url = environment.notifications + 'notifications';
  private urlLogin = environment.notifications + 'user/login';

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  async init() {
    const email = environment.notificationUser.email;
    const password = environment.notificationUser.password;

    this.http.post<any>(this.urlLogin, { email, password }).subscribe(res => {
      const token = res?.data?.access_token;
      console.log("Token: " , token)
      if (token) {
        localStorage.setItem('token', token);
      }
      console.log(res);
    });
  }

  async sendNotification( meetingId: any, userAuth: any, userToCall: any) {
    const token = userToCall?.token;
    const title = 'Incoming call...';
    const body = userAuth?.name + ' is calling you';
    const priority = 'high';
    const userId = userAuth?.uid;
    const name = userAuth?.name;
    const userFrom = userToCall?.uid;


    const payload = {
      token,
      notification: {
        title,
        body
      },
      android : {
        priority,
        data : {
          userId,
          meetingId,
          type: 'incoming_call',
          name,
          userFrom
        }
      },
    };
    console.log("Payload " + JSON.stringify(payload));
    try {
      console.log('🚀 Enviando notificación al servidor:', payload);
      await firstValueFrom(this.http.post(this.url, payload));
      console.log('✅ Notificación enviada correctamente.');
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
    }
  }
}
