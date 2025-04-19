import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NavController} from "@ionic/angular";
import {AuthService} from "../../core/services/auth-service.service";
import {ToastService} from "../../shared/services/toast.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email;

    try {
      await this.authService.resetPassword(email);
      await this.toastService.presentToast('Email sent.','success');
      await this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      await this.toastService.presentToast('Try after.', 'danger');
    }
  }

  goBack() {
    this.navCtrl.back();
  }

}
