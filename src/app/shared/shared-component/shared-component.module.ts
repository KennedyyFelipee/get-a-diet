import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { IonicModule } from '@ionic/angular';
import { InputComponent } from 'src/app/components/input/input.component';
import { SpinningLoaderComponent } from 'src/app/components/spinning-loader/spinning-loader.component';



@NgModule({
  declarations: [
    NavbarComponent,
    InputComponent,
    SpinningLoaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    NavbarComponent,
    InputComponent,
    SpinningLoaderComponent
  ],
  providers: [
  ]
})
export class SharedComponentModule { }
