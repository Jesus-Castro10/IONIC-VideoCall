import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {Contact} from "../../../interfaces/contact";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  standalone: false
})
export class ContactFormComponent implements OnInit {
  @Input() initialData?: Contact;
  @Input() action: 'crear' | 'editar' | 'ver' = 'crear';
  @Input() showDelete = false;

  @Output() save = new EventEmitter<Contact>();
  @Output() delete = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }

    if (this.action === 'ver') {
      this.form.disable();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
      this.modalCtrl.dismiss(this.form.value);
    }
  }

  onDelete() {
    this.delete.emit();
    this.modalCtrl.dismiss({ deleted: true });
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

  get actionLabel() {
    switch (this.action) {
      case 'editar': return 'Actualizar';
      case 'ver': return 'Cerrar';
      default: return 'Guardar';
    }
  }
}
