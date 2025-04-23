import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent  implements OnInit {

  @Input() title: string = "Mi ECommerce";

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("Header", this.title);
  }

  goHome() {
    this.router.navigate(["/home"]);
  }
}
