import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConceptTestPage } from './concept-test.page';

const routes: Routes = [
  {
    path: '',
    component: ConceptTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConceptTestPageRoutingModule {}
