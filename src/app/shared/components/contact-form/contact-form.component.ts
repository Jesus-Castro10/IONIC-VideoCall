import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {Contact} from "../../../interfaces/contact";
import {ContactDto} from "../../../interfaces/contact-dto";

type Actions = 'create' | 'update' | 'read' | 'delete';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  standalone: false
})
export class ContactFormComponent implements OnInit {
  @Input() initialData?: ContactDto;
  @Input() action: Actions = 'create';
  @Input() showDelete = false;

  @Output() save = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      name: ['', ],
      phone: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      const name =this.initialData.user.name
      const phone = this.initialData.user.phone
      this.form.patchValue({name : name, phone: phone});
    }

    if (this.action === 'read') {
      this.form.disable();
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      await this.modalCtrl.dismiss(this.form.value);
    }
  }

  async onDelete() {
    this.delete.emit();
    await this.modalCtrl.dismiss({ deleted: true });
  }

  async cancel() {
    await this.modalCtrl.dismiss(null);
  }

  get actionLabel() {
    switch (this.action) {
      case 'update': return 'Update';
      case 'read': return 'Close';
      default: return 'Save';
    }
  }
}
