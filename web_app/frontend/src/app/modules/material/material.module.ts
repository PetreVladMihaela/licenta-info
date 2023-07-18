import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// in acest modul importam materialele de la angular folosite in celelalte module ale programului
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeBorderOnClickDirective } from 'src/app/change-border-on-click.directive';
import { WaitCursorDirective } from 'src/app/wait-cursor.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [ChangeBorderOnClickDirective, WaitCursorDirective, ConfirmationDialogComponent],

  imports: [ CommonModule, MatButtonModule ],

  exports: [ // materialele importate in acest modul trebuie si exportate, pt. a putea fi accesate in restul aplicatiei  
    MatFormFieldModule, // <- pentru a crea campurile formularelor
    MatInputModule, // <- pentru a putea scrie in campurile formularelor
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    ChangeBorderOnClickDirective,
    WaitCursorDirective
  ]
})
export class MaterialModule { }
