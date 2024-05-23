import { Injectable } from '@angular/core';
import { User } from '../@types/index.';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

type loginData = {
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: AxiosInstance
  public user?: User

  constructor(private cookies: CookieService) {
    this.http = axios.create({
      baseURL: environment.API_URL
    })
  }

  async authenticate(credentials: loginData) {
    const authResponse = await this.http.post(`/sessions`, credentials)

    const { token } = authResponse.data

    this.cookies.set('access-token', token)
  }

  async fetchUser() {
    const accessToken = this.cookies.get('access-token')
    const response = await this.http.get(`/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    this.user = response.data.user
  }
}
