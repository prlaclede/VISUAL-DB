import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'filter-save',
    templateUrl: 'filter.save.html',
})

export class FilterSaveComponent {
    constructor(public dialogRef: MatDialogRef<FilterSaveComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    cancel(): void {
        this.dialogRef.close();
    }
}