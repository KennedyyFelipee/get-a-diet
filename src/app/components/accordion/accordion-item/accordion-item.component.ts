import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Meal } from 'src/app/@types/index.';
import { DietService } from 'src/app/services/diet.service';

@Component({
  selector: 'app-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
})
export class AccordionItemComponent {
  public isLoading: boolean = false;
  public showToast: boolean = false;

  @Input() meal!: Meal;
  @Output() mealCompleted = new EventEmitter<void>();

  constructor(private dietService: DietService) {}

  public async markAsCompleted(mealName: string) {
    if (!this.meal.completed) {
      this.isLoading = true;

      const response = await this.dietService.markMealAsCompleted({ title: mealName });

      if (response.status === 200) {
        this.meal.completed = response.data.mealMarked.completed;
        this.showToast = true;
        this.mealCompleted.emit(); // dispara pro componente pai
      }

      this.isLoading = false;
    }
  }
}