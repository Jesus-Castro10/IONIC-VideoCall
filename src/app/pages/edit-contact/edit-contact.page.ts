import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
  standalone: false,
})
export class EditContactPage {

  form!: FormGroup;

  constructor(private fb: FormBuilder,) {
    this.form = this.fb.group({
      nickname: ['', Validators.minLength(3)],
      phone: ['', [Validators.minLength(7), Validators.required]]
    });
  }

}
