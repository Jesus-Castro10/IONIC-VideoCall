import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {AuthService} from "../../core/services/auth-service.service";
import { LoadingController } from '@ionic/angular';

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
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;

    try {
      await this.showLoading();
      const user = await this.authService.login(email, password);

      if (!user.emailVerified) {
        this.loadingCtrl.dismiss().then(() => this.showToast('Verifica tu correo electrónico antes de continuar'));
        await this.authService.logout(); // Cerramos la sesión
        return;
      }

      this.loadingCtrl.dismiss().then(
        () => this.showToast("Login exitoso")
      );

      this.router.navigate(['/home']);
    } catch (error: any) {
      this.loadingCtrl.dismiss().then(
        () => this.showToast('Credenciales incorrectas o error de conexión.')
      );
    }
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
    });

    await loading.present();
  }
}
