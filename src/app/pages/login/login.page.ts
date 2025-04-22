import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../core/services/auth-service.service";
import {LoaderService} from "../../shared/services/loader.service";
import {ToastService} from "../../shared/services/toast.service";
import {UserService} from "../../core/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private userService: UserService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;

    try {
      await this.loaderService.show("Logging in...");
      const user = await this.authService.login(email, password);

      if (!user.emailVerified) {
        this.loaderService.hide().then(
          () => this.toastService.presentToast("Please check your email before continuing.","danger")
        )
        await this.authService.logout();
        return;
      }

      this.router.navigate(['/home']).then(
        () => {
          this.loaderService.hide()
          this.loginForm.reset()
          const token = localStorage.getItem('fcm');

            this.userService.addUserToken(user, token);

          window.location.reload();
        }
      );
    } catch (error: any) {
      this.loaderService.hide().then(
        () => this.toastService.presentToast("Incorrect credentials or connection error","danger")
      );
    }
  }

  async goToRegister() {
    await this.router.navigate(['/register']);
  }

  async goToForgot() {
    await this.router.navigate(['/forgot-password']);
  }
}
