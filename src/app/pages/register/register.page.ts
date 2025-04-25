import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../core/services/auth-service.service";
import {UserService} from "../../core/services/user.service";
import {ToastService} from "../../shared/services/toast.service";
import {LoaderService} from "../../shared/services/loader.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(6)]],
      lastname: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onRegister() {
    const { email, password, name, lastname, phone } = this.registerForm.value;

    try {
      await this.loaderService.show("Registering...")

      const userAuth = await this.authService.register(email, password);
      const uid = userAuth.uid;
      await this.userService.create({name, lastname, phone, uid, email});
      await this.loaderService.hide()
      await this.toastService.presentToast("User registered successfully","success").then(
        () => {
          this.registerForm.reset()
          this.router.navigate(['/']);
        }
      )
    } catch (error: any) {
      await this.toastService.presentToast("Error registering user","danger")
      console.error(error);
    }
  }

  async goToLogin() {
    await this.router.navigate(['/login']);
  }

}
