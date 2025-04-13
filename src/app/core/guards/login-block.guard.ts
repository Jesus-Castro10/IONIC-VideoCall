import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class LoginBlockGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser || getAuth().currentUser;

    if (user && user.emailVerified) {
      console.log("Usuario logueado")
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}
