import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

type MarkMealAsCompletedInput = {
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class DietService {

  constructor(private authService: AuthService) {
  }

  async markMealAsCompleted(data: MarkMealAsCompletedInput) {
    const response = await this.authService.getHttpClient().patch('/meal/markcompleted', data, { withCredentials: true })

    return response
  }
}
