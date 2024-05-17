import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlterPasswordPageRoutingModule } from './alter-password-routing.module';

import { AlterPasswordPage } from './alter-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlterPasswordPageRoutingModule
  ],
  declarations: [AlterPasswordPage]
})
export class AlterPasswordPageModule {}
