import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { MealAccordionComponent } from 'src/app/components/accordion/meal-accordion/meal-accordion.component';
import { AccordionItemComponent } from 'src/app/components/accordion/accordion-item/accordion-item.component';

import { SharedComponentModule } from 'src/app/shared/shared-component/shared-component.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedComponentModule,
  ],
  declarations: [HomePage, NavbarComponent, MealAccordionComponent, AccordionItemComponent,]
})
export class HomePageModule { }
