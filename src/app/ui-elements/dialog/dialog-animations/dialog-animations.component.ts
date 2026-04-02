import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
    MatDialog,
    MatDialogRef,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-animations',
    standalone: true,
    imports: [MatButtonModule, MatCardModule],
    templateUrl: './dialog-animations.component.html',
    styleUrl: './dialog-animations.component.scss'
})
export class DialogAnimationsComponent {

    // Dialog Animations
    constructor(
        public dialog: MatDialog
    ) {}
    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(DialogAnimationsExampleDialog, {
            width: '250px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

}

// Dialog Overview Example Dialog
@Component({
    selector: 'dialog-animations-example-dialog',
    templateUrl: 'dialog-animations-example-dialog.html',
    styleUrls: ['./dialog-animations.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class DialogAnimationsExampleDialog {

    constructor(
        public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string }
    ) {}

    onNoClick(): void {
        this.dialogRef.close(false); // Retourne false si l'utilisateur annule
    }

    onYesClick(): void {
        this.dialogRef.close(true); // Retourne true si l'utilisateur confirme
    }

}