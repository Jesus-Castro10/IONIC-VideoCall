import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ContactDto} from "../../../interfaces/contact-dto";
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-img-load',
  templateUrl: './img-load.component.html',
  styleUrls: ['./img-load.component.scss'],
  standalone: false,
})
export class ImgLoadComponent {

  @Input() user!: User | undefined;
  @Input() imageUrl!: string;
  @Output() select = new EventEmitter<void>();

  constructor() { }

  onClick() {
    this.select.emit();
  }
}
