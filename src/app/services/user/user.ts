import { Injectable } from '@angular/core';
import { AuthControllerService, AuthResponseDto, LoginRequestDto } from '../../../gs-api/src';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private readonly authenticationService: AuthControllerService,
    private readonly route: Router
  ) {}

  login(authenticationRequest: LoginRequestDto): Observable<AuthResponseDto> {
    return this.authenticationService.login(authenticationRequest);
  }
  setConnectedUser(authenticationResponse: AuthResponseDto): void {
    sessionStorage.setItem('connectedUser', JSON.stringify(authenticationResponse));
    sessionStorage.setItem('accessToken', authenticationResponse.token || '');
  }

  getConnectedUser(): AuthResponseDto {
    if (sessionStorage.getItem('connectedUser')) {
      return JSON.parse(sessionStorage.getItem('connectedUser') as string);
    }
    return {};
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  isUserLoggerAndAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (token && sessionStorage.getItem('connectedUser')) {
      // Check if token is not expired (basic validation)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
      } catch (error) {
        console.error('Token validation error:', error);
        this.logout();
        return false;
      }
    }
    this.route.navigate(['login']);
    return false;
  }

  logout(): void {
    sessionStorage.removeItem('connectedUser');
    sessionStorage.removeItem('accessToken');
    this.route.navigate(['login']);
  }
}
