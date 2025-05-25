import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../../core/services/auth-service.service";
import {UserService} from "../../core/services/user.service";
import {ToastService} from "../../shared/services/toast.service";
import {LoaderService} from "../../shared/services/loader.service";
import { CameraService } from 'src/app/shared/services/camera.service';
import { BucketService } from 'src/app/core/services/bucket.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  previewImage: string = '';
  imageBlob: Blob | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private userService: UserService,
    private loaderService: LoaderService,
    private cameraSrv: CameraService,
    private bucketSrv: BucketService
  ) {

  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      image: [null]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onRegister() {
    const { email, password, name, lastname, phone, image } = this.registerForm.value;

    try {
      await this.loaderService.show("Registering...")
      const imageUrl = await this.bucketSrv.uploadImage(image, email);
      const userAuth = await this.authService.register(email, password);
      const uid = userAuth.uid;
      await this.userService.create({name, lastname, phone, uid, email, image: imageUrl});
      await this.loaderService.hide()
      await this.toastService.presentToast("User registered successfully","success").then(
        () => {
          this.registerForm.reset()
          this.router.navigate(['/']);
        }
      )
    } catch (error: any) {
      await this.toastService.presentToast("Error registering user","danger")
      await this.loaderService.hide()
      console.error(error);
    }
  }

  async goToLogin() {
    await this.router.navigate(['/login']);
  }

  async pickImage() {
    try {
      this.imageBlob = await this.cameraSrv.pickPicture();
      this.previewImage = URL.createObjectURL(this.imageBlob);
      this.registerForm.patchValue({ image: this.imageBlob });
    } catch (err) {
      console.error('Error capturando imagen', err);
    }
  }

}
