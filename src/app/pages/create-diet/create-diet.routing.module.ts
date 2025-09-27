import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDietPage } from './create-diet.page';

const routes: Routes = [
  {
    path: '',
    component: CreateDietPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateDietPageRoutingModule {}
