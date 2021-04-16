import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatTabsModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
