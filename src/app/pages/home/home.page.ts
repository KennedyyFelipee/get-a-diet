import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public greeting!: String
  public userNameFormatted: string = ""
  public days_in_offensive: number = 0


  constructor(private AuthService: AuthService) { }

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

  async fetchData() {
    const loginInfo = {
      "email": "johndoe@example5.com",
      "password": "123456"
    }

    await this.AuthService.authenticate(loginInfo)

    await this.AuthService.fetchUser()
  }

  async ngOnInit(): Promise<void> {
    this.greeting = this.generateGreeting()

    if (!this.AuthService.user) {
      await this.fetchData()
    }

    if (this.AuthService.user) {
      this.userNameFormatted = this.AuthService.user.name.split(" ")[0];
      this.days_in_offensive = this.AuthService.user.days_in_offensive;
    }
  }
}
