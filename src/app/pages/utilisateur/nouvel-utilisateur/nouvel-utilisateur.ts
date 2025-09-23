import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../../services/utilisateur/utilisateur.service';
import { UtilisateurResponseDto } from '../../../../gs-api/src';

@Component({
  selector: 'app-nouvel-utilisateur',
  imports: [FormsModule, CommonModule],
  templateUrl: './nouvel-utilisateur.html',
  styleUrl: './nouvel-utilisateur.css'
})
export class NouvelUtilisateur implements OnInit {

  utilisateur = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    dateDeNaissance: '',
    adresse1: '',
    adresse2: '',
    ville: '',
    codePostal: '',
    pays: '',
    entrepriseId: 1 // Default enterprise ID
  };

  selectedImage: File | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isEditMode = false;
  utilisateurId: number | null = null;
  showPassword = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly utilisateurService: UtilisateurService
  ) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.utilisateurId = +id;
      this.isEditMode = true;
      this.loadUtilisateur(this.utilisateurId);
    }
  }

  loadUtilisateur(id: number): void {
    this.isLoading = true;
    this.utilisateurService.getUtilisateurById(id).subscribe({
      next: (utilisateur: UtilisateurResponseDto) => {
        this.utilisateur = {
          nom: utilisateur.nom || '',
          prenom: utilisateur.prenom || '',
          email: utilisateur.email || '',
          motDePasse: '', // Don't load password for security
          dateDeNaissance: utilisateur.dateDeNaissance ? this.formatDate(utilisateur.dateDeNaissance) : '',
          adresse1: utilisateur.adresse?.adresse1 || '',
          adresse2: utilisateur.adresse?.adresse2 || '',
          ville: utilisateur.adresse?.ville || '',
          codePostal: utilisateur.adresse?.codePostal || '',
          pays: utilisateur.adresse?.pays || '',
          entrepriseId: utilisateur.entreprise?.id || 1
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'utilisateur: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  save(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.utilisateurId) {
      this.updateUtilisateur();
    } else {
      this.createUtilisateur();
    }
  }

  createUtilisateur(): void {
    this.utilisateurService.createUtilisateur(
      this.utilisateur.nom,
      this.utilisateur.prenom,
      this.utilisateur.email,
      this.utilisateur.motDePasse,
      this.utilisateur.dateDeNaissance,
      this.utilisateur.adresse1,
      this.utilisateur.ville,
      this.utilisateur.codePostal,
      this.utilisateur.pays,
      this.utilisateur.entrepriseId,
      this.utilisateur.adresse2,
      this.selectedImage || undefined
    ).subscribe({
      next: (response: UtilisateurResponseDto) => {
        this.successMessage = 'Utilisateur créé avec succès!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['utilisateurs']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création de l\'utilisateur: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  updateUtilisateur(): void {
    if (!this.utilisateurId) return;
    
    // Don't send password if it's empty in edit mode
    const passwordToSend = this.utilisateur.motDePasse || '';
    
    this.utilisateurService.updateUtilisateur(
      this.utilisateurId,
      this.utilisateur.nom,
      this.utilisateur.prenom,
      this.utilisateur.email,
      passwordToSend,
      this.utilisateur.dateDeNaissance,
      this.utilisateur.adresse1,
      this.utilisateur.ville,
      this.utilisateur.codePostal,
      this.utilisateur.pays,
      this.utilisateur.entrepriseId,
      this.utilisateur.adresse2,
      this.selectedImage || undefined
    ).subscribe({
      next: (response: UtilisateurResponseDto) => {
        this.successMessage = 'Utilisateur modifié avec succès!';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['utilisateurs']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la modification de l\'utilisateur: ' + (error.error?.message || error.message);
        this.isLoading = false;
      }
    });
  }

  private validateForm(): boolean {
    // For edit mode, password is optional
    const requiredFields = [
      this.utilisateur.nom,
      this.utilisateur.prenom,
      this.utilisateur.email,
      this.utilisateur.dateDeNaissance,
      this.utilisateur.adresse1,
      this.utilisateur.ville,
      this.utilisateur.codePostal,
      this.utilisateur.pays
    ];

    // Password is required only for creation
    if (!this.isEditMode && !this.utilisateur.motDePasse) {
      requiredFields.push(this.utilisateur.motDePasse);
    }

    if (requiredFields.some(field => !field)) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.utilisateur.email)) {
      this.errorMessage = 'Veuillez entrer un email valide';
      return false;
    }

    return true;
  }


  cancel(): void {
    this.router.navigate(['utilisateurs']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
