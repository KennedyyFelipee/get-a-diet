import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlterPasswordPage } from './alter-password.page';

const routes: Routes = [
  {
    path: '',
    component: AlterPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlterPasswordPageRoutingModule {}
