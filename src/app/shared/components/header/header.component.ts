import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {

  @Input() title: string = "Jit Call";
  @Input() isLoggedIn: boolean = false;
  @Input() isHome: boolean = false;

  constructor(private router: Router) { }

  async goHome() {
    await this.router.navigate(["/home"]);
  }
}
