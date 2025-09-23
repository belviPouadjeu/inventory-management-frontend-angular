import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user/user';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';
import { UtilisateurResponseDto } from '../../../../gs-api/src';

@Component({
  selector: 'app-page-profil',
  imports: [CommonModule],
  templateUrl: './page-profil.html',
  styleUrls: ['./page-profil.css']
})
export class PageProfil {
  connectedUser: any = null;
  utilisateur: UtilisateurResponseDto | null = null;
  // Display fields to avoid template typing issues
  displayFullName = '';
  displayEmail = '';
  displayPhone = '-';
  displayAddress = '';
  displayEntreprise = '-';

  constructor(
    private router: Router,
    private userService: UserService,
    private utilisateurService: UtilisateurService
  ) {
    this.connectedUser = this.userService.getConnectedUser();
    // If we have an ID, load full details from backend
    const id: any = (this.connectedUser as any)?.user?.id || (this.connectedUser as any)?.id || (this.connectedUser as any)?.utilisateurId;
    if (id) {
      this.utilisateurService.getUtilisateurById(+id).subscribe({
        next: (u) => {
          this.utilisateur = u;
          this.computeDisplayFields();
        },
        error: () => {}
      });
    }
    // Initial compute based on token payload if available
    this.computeDisplayFields();
  }

  editProfil(): void {
    const id: any = this.utilisateur?.id || (this.connectedUser as any)?.user?.id || (this.connectedUser as any)?.id || (this.connectedUser as any)?.utilisateurId;
    if (id) {
      this.router.navigate(['nouvelutilisateur', id]);
    } else {
      // fallback: open creation form
      this.router.navigate(['nouvelutilisateur']);
    }
  }

  modifierMotDePasse(): void {
    this.router.navigate(['changermotdepasse'])
  }

  private computeDisplayFields(): void {
    const prenom = (this.utilisateur as any)?.prenom || (this.connectedUser as any)?.user?.prenom || this.connectedUser?.prenom || '';
    const nom = (this.utilisateur as any)?.nom || (this.connectedUser as any)?.user?.nom || this.connectedUser?.nom || '';
    this.displayFullName = `${prenom} ${nom}`.trim();

    this.displayEmail = (this.utilisateur as any)?.email || (this.connectedUser as any)?.user?.email || this.connectedUser?.email || '';

    const addr: any = (this.utilisateur as any)?.adresse || {};
    const parts = [addr.adresse1, addr.ville, addr.codePostal, addr.pays].filter(Boolean);
    this.displayAddress = parts.join(', ');

    this.displayPhone = (this.utilisateur as any)?.telephone || (this.utilisateur as any)?.numTel || '-';

    const ent: any = (this.utilisateur as any)?.entreprise || {};
    this.displayEntreprise = ent.nom || ent.name || '-';
  }
}
