import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public greeting!: String
  public userName!: String

  private apiUrl: string = 'https://api-get-a-diet-production.up.railway.app'

  constructor(private cookies: CookieService) { }

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
      "email": "johndoe@example4.com",
      "password": "123456"
    }

    const authResponse = await axios.post(`${this.apiUrl}/sessions`, loginInfo)

    const { token } = authResponse.data

    this.cookies.set('access-token', token)

    const userDataResponse = await axios.get(`${this.apiUrl}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return userDataResponse.data.user


  }

  ngOnInit(): void {
    this.greeting = this.generateGreeting()

    this.fetchData().then(userDataResponse => {
      const userNameFormatted = userDataResponse.name.split(" ")[0]
      this.userName = userNameFormatted
    }
    )


  }

}
