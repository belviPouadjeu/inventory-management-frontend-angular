import { Component, OnInit } from '@angular/core';
import {RouterLink} from '@angular/router';
import { UserService } from '../../services/user/user';
import { UtilisateurService } from '../../services/utilisateur/utilisateur.service';
import { UtilisateurResponseDto } from '../../../gs-api/src';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header implements OnInit {
  connectedUser: any = null;
  displayName = 'Utilisateur';

  constructor(private readonly userService: UserService,
              private readonly utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.connectedUser = this.userService.getConnectedUser();
    this.updateDisplayNameFromConnectedUser();
    const id: any = this.connectedUser?.user?.id || this.connectedUser?.id || this.connectedUser?.utilisateurId;
    if (id) {
      this.utilisateurService.getUtilisateurById(+id).subscribe({
        next: (u: UtilisateurResponseDto) => {
          const nom = (u as any)?.nom || '';
          const prenom = (u as any)?.prenom || '';
          const full = `${prenom} ${nom}`.trim();
          if (full.trim()) this.displayName = full;
        },
        error: () => {}
      });
    }
  }

  private updateDisplayNameFromConnectedUser() {
    const nom = this.connectedUser?.user?.nom || this.connectedUser?.nom || '';
    const prenom = this.connectedUser?.user?.prenom || this.connectedUser?.prenom || '';
    const full = `${prenom} ${nom}`.trim();
    if (full.trim()) this.displayName = full;
  }

  logout(): void {
    this.userService.logout();
  }
}
