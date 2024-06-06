import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/@types/index.';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private user!: User | null
  public userNameFormatted: string = ""
  public days_in_offensive: number = 0
  public orientations: string[] | null = null
  public hasDiet: boolean = false

  public greeting!: String
  public loading: boolean = true


  constructor(private authService: AuthService) { }

  generateGreeting() {
    const timeOfDay = new Date().getHours()

    if (timeOfDay < 12) {
      return 'Bom dia'
    } else if (timeOfDay < 18) {
      return 'Boa tarde'
    } else {
      return 'Boa noite'
    }
  }

  async testarAccessToken() {
    await this.authService.fetchUser()

    this.authService.getUser().subscribe(data => console.log(data))
  }

  async ngOnInit(): Promise<void> {
    this.loading = true
    this.greeting = this.generateGreeting()

    await this.authService.fetchUser()

    this.authService.getUser().subscribe(data => this.user = data)

    if (this.user) {
      this.userNameFormatted = this.user.name.split(" ")[0];
      this.days_in_offensive = this.user.days_in_offensive;

      if (this.user.diet) {
        this.hasDiet = true
        this.orientations = this.user.diet.orientations
      }
    }

    this.loading = false
  }
}
