import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatGridListModule,
  MatPaginatorModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatSidenavModule,
  MatInputModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatGridListModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatSidenavModule,
  MatInputModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
];

/**
 * 
 * 
 * @export
 * @class MaterialModule
 */
@NgModule({
  imports: [
    materialModules,
    BrowserAnimationsModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  exports: [
    materialModules,
    BrowserAnimationsModule,
    FormsModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  declarations: [],
  providers: [MatIconRegistry],
})
export class MaterialModule { }