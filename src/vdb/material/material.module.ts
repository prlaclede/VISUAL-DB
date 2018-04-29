import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatFormFieldModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
} from '@angular/material';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const materialModules = [
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatListModule,
  MatMenuModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatSidenavModule,
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
    BrowserAnimationsModule
  ],
  exports: [
    materialModules,
    BrowserAnimationsModule
  ],
  declarations: [],
  providers: [MatIconRegistry],
})
export class MaterialModule { }