import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser || getAuth().currentUser;
    console.log(user);
    if (user && user.emailVerified) {
      return true;
    }

    const toast = await this.toastCtrl.create({
      message: 'Debes iniciar sesion',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });

    await toast.present();
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.router.navigate(['/login']);
    return false;
  }
}
