import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';

@Component({
  selector: 'app-changer-mot-de-passe',
  imports: [CommonModule, FormsModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrls: ['./changer-mot-de-passe.css']
})
export class ChangerMotDePasse {
  // display info
  displayFullName = '';
  displayAddress = '';

  // form fields
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  // toggles
  showOld = false;
  showNew = false;
  showConfirm = false;

  // ui
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private utilisateurService: UtilisateurService
  ) {
    const cu: any = this.userService.getConnectedUser();
    const prenom = cu?.user?.prenom || cu?.prenom || '';
    const nom = cu?.user?.nom || cu?.nom || '';
    this.displayFullName = `${prenom} ${nom}`.trim();
    const addr: any = cu?.user?.adresse || {};
    const parts = [addr?.adresse1, addr?.ville, addr?.codePostal].filter(Boolean);
    this.displayAddress = parts.join(', ');
  }

  cancel(): void {
    this.router.navigate(['profil'])
  }

  toggleOld() { this.showOld = !this.showOld; }
  toggleNew() { this.showNew = !this.showNew; }
  toggleConfirm() { this.showConfirm = !this.showConfirm; }

  save(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Mot de passe modifié (simulation). Intégrez l\'endpoint backend pour finaliser.';
    }, 500);
  }
}
