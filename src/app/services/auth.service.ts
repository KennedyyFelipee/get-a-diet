import { Injectable } from '@angular/core';
import { User } from '../@types/index.';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { refreshTokenInvalidError } from '../errors/refresh-token-invalid-error';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';

type loginData = {
  email: string,
  password: string
}

type userInput = {
  name: string,
  crn: string,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private cookies: CookieService, private http: HttpClientService) {
  }

  public async refreshAccessToken() {
    const response = await axios.patch(`${environment.API_URL}/token/refresh`, {}, { withCredentials: true })

    const { token } = response.data

    this.cookies.set('get-a-diet.access-token', token)
    return response
  }

  async authenticate(credentials: loginData) {
    const authResponse = await this.http.post(`/sessions`, credentials, { withCredentials: true })

    const { token } = authResponse.data

    this.cookies.set('get-a-diet.access-token', token)
  }

  async fetchUser() {
    const accessToken = this.cookies.get('get-a-diet.access-token')
    const response = await this.http.get(`/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    this.userSubject.next(response.data.user)
  }

  async register(newUser: userInput) {
    await this.http.post('/users', newUser)
  }

  getUser() {
    return this.user$
  }
}
