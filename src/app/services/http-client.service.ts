import { Injectable } from '@angular/core';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { refreshTokenInvalidError } from '../errors/refresh-token-invalid-error';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private http: AxiosInstance

  constructor(private authService: AuthService) {
    this.http = axios.create({
      baseURL: environment.API_URL,
    })

    this.http.interceptors.response.use((res) => res, async (err: AxiosError) => {
      if (err.response?.status === 401) {
        const res = await this.authService.refreshAccessToken()

        if (res.status !== 200) {
          throw new refreshTokenInvalidError()
        }
      }
    })
  }
}
