// src/app/pages/create-diet/create-diet.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CreateDietPage } from './create-diet.page';
import { SharedComponentModule } from 'src/app/shared/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedComponentModule,
    RouterModule.forChild([{ path: '', component: CreateDietPage }]),
  ],
  declarations: [CreateDietPage],
})
export class CreateDietPageModule {}
