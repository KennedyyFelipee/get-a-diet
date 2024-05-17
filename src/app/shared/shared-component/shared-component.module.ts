import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    NavbarComponent
  ],
  providers: [
  ]
})
export class SharedComponentModule { }
