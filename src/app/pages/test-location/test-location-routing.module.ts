import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestLocationPage } from './test-location.page';

const routes: Routes = [
  {
    path: '',
    component: TestLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestLocationPageRoutingModule {}
