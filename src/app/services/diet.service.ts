import { Injectable } from '@angular/core'
import { AuthService } from './auth.service'

type MarkMealAsCompletedInput = {
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class DietService {
  constructor(private authService: AuthService) {}

  async markMealAsCompleted(data: MarkMealAsCompletedInput) {
    const response = await this.authService.getHttpClient().patch('/meal/markcompleted', data, {
      withCredentials: true
    })

    return response.data
  }

  async createDiet(payload: { title: string; meals: any[] }) {
    const accessToken =
      this.authService.getHttpClient().defaults.headers['Authorization'] ??
      `Bearer ${this.authService['cookies'].get('get-a-diet.access-token')}`

    const response = await this.authService.getHttpClient().post('/diets', payload, {
      headers: { Authorization: accessToken },
      withCredentials: true
    })

    return response.data
  }
}