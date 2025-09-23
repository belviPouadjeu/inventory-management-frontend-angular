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
    localStorage.setItem('connectedUser', JSON.stringify(authenticationResponse));
    localStorage.setItem('accessToken', authenticationResponse.token || '');
  }

  getConnectedUser(): AuthResponseDto {
    if (localStorage.getItem('connectedUser')) {
      return JSON.parse(localStorage.getItem('connectedUser') as string);
    }
    return {};
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isUserLoggerAndAccessTokenValid(): boolean {
    const token = this.getAccessToken();
    if (token && localStorage.getItem('connectedUser')) {
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
    localStorage.removeItem('connectedUser');
    localStorage.removeItem('accessToken');
    this.route.navigate(['login']);
  }
}
