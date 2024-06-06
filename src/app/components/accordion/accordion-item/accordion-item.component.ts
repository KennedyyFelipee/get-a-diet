import { Component, Input, Output } from '@angular/core';
import { Meal } from 'src/app/@types/index.';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
})
export class AccordionItemComponent {
  @Input() meal!: Meal

  constructor() { }

  @Output()
  public markAsCompleted(mealName: string) {
    if (this.meal.completed) {
      return
    }
    this.meal.completed = new Date()
    console.log(this.meal)
    console.log('refeiçao completa:', mealName)
  }
}
