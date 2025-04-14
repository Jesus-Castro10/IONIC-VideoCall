import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactDetailPage } from './contact-detail.page';
import {AuthGuard} from "../../core/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ContactDetailPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactDetailPageRoutingModule {}
