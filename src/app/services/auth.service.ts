import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment'
import { Auth } from '../models/auth.models';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.API_URL}/api/auth`

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string) {
    return this.http.post<Auth>(`${this.apiUrl}/login`, {email, password})
    .pipe(
      tap(response => this.tokenService.saveToken(response.access_token))
    );
  }

  // Forma de utilizar headers con HttpHeaders:
  profile(token: string) {
    const headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.apiUrl}/profile`, {headers});
  }

  // Forma de utilizar headers como objeto:
  profile2(token: string) {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
        //content-type: 'application/json'
      }
    });
  }

  // Obtener profile con token enviado dede un interceptor:
  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
    });
  }

  // Hacer login y obtener perfil con switchMap
  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap(() => this.getProfile())
    );
  }
}
