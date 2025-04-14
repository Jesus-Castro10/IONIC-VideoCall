import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import {ToastService} from "../../shared/services/toast.service";
import {AuthService} from "../services/auth-service.service";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();

    if (user && user.emailVerified) {
      return true;
    }

    await this.toastService.presentToast("You must log in","danger").then(
      () => this.router.navigate(['/login'])
    )

    return false;
  }
}
