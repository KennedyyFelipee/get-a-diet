import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';

import { EditProfilePage } from './edit-profile.page';
import { SharedComponentModule } from 'src/app/shared/shared-component/shared-component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfilePageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
