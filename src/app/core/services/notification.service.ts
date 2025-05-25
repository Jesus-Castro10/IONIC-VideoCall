import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private url = environment.notifications + 'notifications';
  private urlLogin = environment.notifications + 'user/login';

  constructor(private http: HttpClient, private userService: UserService) {}

  async init() {
    const email = environment.notificationUser.email;
    const password = environment.notificationUser.password;

    this.http.post<any>(this.urlLogin, { email, password }).subscribe((res) => {
      const token = res?.data?.access_token;
      console.log('Token: ', token);
      if (token) {
        localStorage.setItem('token', token);
      }
      console.log(res);
    });
  }

  // async sendNotification( meetingId: any, userSend: any, userRecivier: any) {
  //   const token = userRecivier?.token;
  //   const title = 'Incoming call...';
  //   const body = userSend?.name + ' is calling you';
  //   const priority = 'high';
  //   const userId = userSend?.uid;
  //   const name = userSend?.name;
  //   const userFrom = userRecivier?.uid;

  //   const payload = {
  //     token,
  //     notification: {
  //       title,
  //       body
  //     },
  //     android : {
  //       priority,
  //       data : {
  //         userId,
  //         meetingId,
  //         type: 'incoming_call',
  //         name,
  //         userFrom
  //       }
  //     },
  //   };
  //   console.log("Payload " + JSON.stringify(payload));
  //   try {
  //     console.log('🚀 Enviando notificación al servidor:', payload);
  //     await firstValueFrom(this.http.post(this.url, payload));
  //     console.log('✅ Notificación enviada correctamente.');
  //   } catch (error) {
  //     console.error('❌ Error al enviar notificación:', error);
  //   }
  // }

  async sendNotification(
    type: 'incoming_call' | 'message',
    data: {
      meetingId?: string;
      userSend: { uid: string; name: string };
      userReceiver: { uid: string; name: string; token?: string };
    }
  ) {
    const { userSend, userReceiver, meetingId } = data;
    const token = userReceiver?.token;
    const priority = 'high';

    const titles = {
      incoming_call: 'Incoming call...',
      message: 'New message received',
    };

    const bodies = {
      incoming_call: `${userSend.name} is calling you`,
      message: `${userSend.name}: 'Sent you a message'`,
    };

    const payload = {
      token,
      notification: {
        title: titles[type],
        body: bodies[type],
      },
      android: {
        priority,
        data: {
          type: 'incoming_call',
          userId: userSend.uid,
          name: userSend.name,
          userFrom: userReceiver.uid,
          meetingId: meetingId || 'no_meeting',
        },
      },
    };

    console.log('Payload', JSON.stringify(payload));

    try {
      console.log('🚀 Enviando notificación al servidor:', payload);
      await firstValueFrom(this.http.post(this.url, payload));
      console.log('✅ Notificación enviada correctamente.');
    } catch (error) {
      console.error('❌ Error al enviar notificación:', error);
    }
  }
}
