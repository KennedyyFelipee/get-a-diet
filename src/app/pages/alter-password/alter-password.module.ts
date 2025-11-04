import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterPasswordPageRoutingModule } from './alter-password-routing.module';

import { AlterPasswordPage } from './alter-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlterPasswordPageRoutingModule,
    ReactiveFormsModule
],
  declarations: [AlterPasswordPage]
})
export class AlterPasswordPageModule {}
