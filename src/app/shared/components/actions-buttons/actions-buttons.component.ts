import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

type Actions = 'create' | 'update' | 'read';

@Component({
  selector: 'app-actions-buttons',
  templateUrl: './actions-buttons.component.html',
  styleUrls: ['./actions-buttons.component.scss'],
  standalone: false
})
export class ActionsButtonsComponent {

  @Input() action: Actions = 'read';
  @Input() icon: string = 'close-circle';
  @Output() clicked = new EventEmitter<void>();
  @Output() otherClicked = new EventEmitter<void>();

  constructor() { }

  get actionLabel() {
    switch (this.action) {
      case 'read': return 'Edit Contact';
      default: return 'Save Changes';
    }
  }

  get otherLabel() {
    switch (this.action) {
      case 'read': return 'Call';
      default: return 'Cancel';
    }
  }

  onClick() {
    this.clicked.emit();
  }

  onOtherClick() {
    this.otherClicked.emit();
  }
}
