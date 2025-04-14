import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import {ToastService} from "../../shared/services/toast.service";
import {AuthService} from "../services/auth-service.service";

@Injectable({ providedIn: 'root' })
export class LoginBlockGuard implements CanActivate {
  private router = inject(Router);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();

    if (user && user.emailVerified) {
      this.toastService.presentToast("You cannot access this view","danger").then(
        () => this.router.navigate(['/home'])
      )
      return false;
    }

    return true;
  }
}
