import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DietService } from 'src/app/services/diet.service';

@Component({
  selector: 'app-create-diet',
  templateUrl: './create-diet.page.html',
  styleUrls: ['./create-diet.page.scss'],
})
export class CreateDietPage implements OnInit {

  public showToast: boolean = false; //aviso de sucesso de criação 

  dietForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dietService: DietService,
    private router: Router
  ) {
    this.dietForm = this.fb.group({
      title: ['', Validators.required],
      meals: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addMeal();
  }

  get meals(): FormArray {
    return this.dietForm.get('meals') as FormArray;
  }

  getItems(mealIndex: number): FormArray {
    return this.meals.at(mealIndex).get('items') as FormArray;
  }

  private createMealGroup(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  private createItemGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit: ['Unid', Validators.required],
    });
  }

  addMeal(): void {
    this.meals.push(this.createMealGroup());
  }

  removeMeal(index: number): void {
    this.meals.removeAt(index);
  }

  addItem(mealIndex: number): void {
    this.getItems(mealIndex).push(this.createItemGroup());
  }

  removeItem(mealIndex: number, itemIndex: number): void {
    this.getItems(mealIndex).removeAt(itemIndex);
  }

  

async onSubmit(): Promise<void> {
  if (this.dietForm.invalid) {
    this.dietForm.markAllAsTouched();
    return;
  }

  const payload = {
    title: this.dietForm.value.title,
    meals: this.dietForm.value.meals.map((meal: any) => ({
      title: meal.title,
      completed: null,
      items: meal.items.map((item: any) => ({
        name: item.name,
        description: item.description || null,
        quantity: Number(item.quantity),
        unit: item.unit,
      })),
    })),
  };

  try {
  await this.dietService.createDiet(payload);
  this.showToast = true;

    // Aguarda o toast aparecer antes de redirecionar
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
    } catch (error: any) {  
      const status = error?.status ?? error?.response?.status;
      if (status === 401 || status === 403) {
        alert('Sem permissão para criar dietas.');
      } else if (status === 404) {
        alert('Usuário não encontrado.');
      } else {
        console.error(error);
        alert('Erro ao criar dieta.');
      }
    }
  }
}