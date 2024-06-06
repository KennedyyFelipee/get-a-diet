import { Component, Input, OnInit } from '@angular/core';
import { Diet, Meal, MealItem, User } from 'src/app/@types/index.';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-meal-accordion',
  templateUrl: './meal-accordion.component.html',
  styleUrls: ['./meal-accordion.component.scss'],
})
export class MealAccordionComponent implements OnInit {
  @Input() meals?: Meal[] | null

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.authService.getUser().subscribe(data => this.meals = data?.diet?.meals)
  }

}
