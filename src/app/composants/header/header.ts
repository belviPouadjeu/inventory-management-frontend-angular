import { Component, OnInit } from '@angular/core';
import {RouterLink} from '@angular/router';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  connectedUser: any = null;

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.connectedUser = this.userService.getConnectedUser();
  }

  logout(): void {
    this.userService.logout();
  }
}
