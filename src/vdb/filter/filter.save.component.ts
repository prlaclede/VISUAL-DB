import { Component, Output, Inject, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'filter-save',
    templateUrl: 'filter.save.html',
})

export class FilterSaveComponent {
    constructor(public dialogRef: MatDialogRef<FilterSaveComponent>) { }

    @Output() filterNameSubmit = new EventEmitter<any>();

    cancel(): void {
        this.dialogRef.close();
    }

    saveFilter(filterName, defaultFilter) {
        let returnData = new Array<any>();
        returnData['filterName'] = filterName;
        returnData['defaultFilter'] = defaultFilter;

        this.filterNameSubmit.emit(returnData);
        this.dialogRef.close();
    }
}