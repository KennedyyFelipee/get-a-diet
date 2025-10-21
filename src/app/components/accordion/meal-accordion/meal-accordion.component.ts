import { Component, Input, OnInit } from '@angular/core';
import { Meal } from 'src/app/@types/index.';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-meal-accordion',
  templateUrl: './meal-accordion.component.html',
  styleUrls: ['./meal-accordion.component.scss'],
})
export class MealAccordionComponent implements OnInit {
  @Input() meals?: Meal[] | null;
  public showToast: boolean = false;

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.authService.getUser().subscribe(data => {
      this.meals = data?.diet?.meals;
    });
  }

  async handleMealCompleted() {
    this.showToast = true;

    setTimeout(async () => {
      await this.authService.fetchUser(); // atualiza os dados do usuário
      this.authService.getUser().subscribe(data => {
        this.meals = data?.diet?.meals;
      });
    }, 1000);
  }
}