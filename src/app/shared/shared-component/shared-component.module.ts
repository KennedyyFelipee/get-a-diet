import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from 'src/app/components/input/input.component';



@NgModule({
  declarations: [
    NavbarComponent,
    InputComponent,
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    NavbarComponent,
    InputComponent,
  ],
  providers: [
  ]
})
export class SharedComponentModule { }
