import { Component, OnInit } from '@angular/core';
import {MyCustomPlugin} from "../../../../../plugins/my-custom-plugin";

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
  standalone: false
})
export class TestPage {

  constructor() { }

  async testPluginMethod(msg: string){
    await MyCustomPlugin.testPluginMethod({msg:msg}).then(result => {
      alert("Response is " + JSON.stringify(result));
    }).catch(error => {
      alert("There are a fucking problem " + error);
    });
  }

}
