import { Injectable } from '@angular/core';
import { User } from '../@types/index.';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

import { BehaviorSubject, Observable } from 'rxjs';

type loginData = {
  email: string,
  password: string
}

type userInput = {
  name: string,
  crn: string | null,
  email: string,
  password: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http: AxiosInstance
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private cookies: CookieService) {
    this.http = axios.create({
      baseURL: environment.API_URL,
    })

    this.http.interceptors.response.use(
      (res) => res,
      async (err: AxiosError) => {
        const originalRequest = err.config;

        if (err.response?.status === 401) {
          const res = await this.refreshAccessToken();

          if (res.status === 200 && originalRequest) {
            const newAccessToken = this.cookies.get('get-a-diet.access-token');

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

            return this.http(originalRequest)
          } else {
            console.error(`An error occured. Error code: ${res.status} (${res.statusText})`)
            return err.response.status
          }
        }

        return Promise.reject(err);
      }
    );
  }

  async refreshAccessToken() {
    try {
      const response = await this.http.patch(`${environment.API_URL}/token/refresh`, {}, { withCredentials: true });

      const { token } = response.data;

      if (response.status === 200) {
        const tenMinutesLater = 1 / 24 / 6
      this.cookies.set('get-a-diet.access-token', token, {expires: tenMinutesLater})
      }

      return response;
    } catch (err: any) {
      return err.response
    }
  }


  async authenticate(credentials: loginData) {
    const authResponse = await this.http.post(`/sessions`, credentials, { withCredentials: true })

    const { status, data: { token } } = authResponse

    if (status === 200) {
      const tenMinutesLater = 1 / 24 / 6
      this.cookies.set('get-a-diet.access-token', token, {expires: tenMinutesLater})
    }

    return status
  }

  async fetchUser() {
    const accessToken = this.cookies.get('get-a-diet.access-token')
    const response = await this.http.get(`/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status === 200) {
      const { data } = response
      this.userSubject.next(data.user)

    }

    return response.status
  }

  async register(newUser: userInput) {
    try {
      const response = await this.http.post('/users', newUser)
      return response
    } catch (error:any) {
      return error.response
    }
  }

  async logout() {
    try {
      const accessToken = this.cookies.get('get-a-diet.access-token');
      await this.http.delete(`${environment.API_URL}/sessions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials : true
      });

      this.cookies.delete('get-a-diet.access-token');
      this.cookies.delete('get-a-diet.refreshToken');
     
      return true;
    } catch (error) {
     
      console.error('Erro ao fazer logout:', error);
      return false;
    }
  }

  getUser() {
    return this.user$
  }

  getHttpClient() {
    return this.http
  }
}
