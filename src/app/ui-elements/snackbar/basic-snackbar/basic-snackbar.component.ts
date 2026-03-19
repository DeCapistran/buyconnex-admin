import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basic-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-snackbar">
      ✅ {{ data }}
    </div>
  `,
  styles: [`
    .custom-snackbar {
    /* Fond bleu semi-transparent (alpha = 0.85) */
    background-color: rgba(55, 97, 238, 0.85) !important;
    /* Texte blanc */
    color: white !important;
    /* Ombre légère */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2) !important;
    /* Le reste de ton style */
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    text-align: center;
    display: inline-block;
}

  `]
})
export class BasicSnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {}
}
