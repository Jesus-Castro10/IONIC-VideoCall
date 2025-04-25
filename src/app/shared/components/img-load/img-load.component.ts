import {Component, Input} from '@angular/core';
import {ContactDto} from "../../../interfaces/contact-dto";

@Component({
  selector: 'app-img-load',
  templateUrl: './img-load.component.html',
  styleUrls: ['./img-load.component.scss'],
  standalone: false,
})
export class ImgLoadComponent {

  @Input() contact!: ContactDto;

  constructor() { }

}
