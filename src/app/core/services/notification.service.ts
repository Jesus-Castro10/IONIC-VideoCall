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

  private url = environment.notifications;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  async sendNotification( meetingId: any, name: any, uidUserFrom: string) {
    const user = await this.userService.get(uidUserFrom)
    const token = user?.token as string;
    const title = "Incoming call";
    const body = name + " is calling you"
    const userFrom = user?.name as string;
    const payload = {
      token,
      title,
      body,
      meetingId,
      name,
      userFrom
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
