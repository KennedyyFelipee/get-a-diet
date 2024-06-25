import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/@types/index.';

import { AuthService } from 'src/app/services/auth.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';

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

  constructor(private authService: AuthService, private darkMode: DarkModeService, private router: Router) { }

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

    const isDarkMode = this.darkMode.getDarkMode();
    this.darkMode.applyDarkMode(isDarkMode);

    this.loading = true
    this.greeting = this.generateGreeting()

    const responseStatus = await this.authService.fetchUser()

    if (responseStatus === 200) {
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
    } else {
      this.router.navigateByUrl('/login')
    }


  }
}
