import { Component, Inject } from '@angular/core';
import { Directive, HostListener } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';

import { FilterSaveComponent } from './filter.save.component';

import { SpaceService } from '../space/space.service';
import { NoteService } from '../note/note.service';
import { CommonService } from '../common/common.service';

@Component({
    selector: 'filter',
    templateUrl: 'filter.html',
    styleUrls: ['filter.css'],
})
export class FilterComponent {

    /* the operators and their values to load into the filters form */
    operators: Array<any> = [
        { name: 'LIKE', value: 'like' },
        { name: 'EQUALS', value: '=' },
        { name: 'GREATER THAN', value: '>' },
        { name: 'LESS THAN', value: '<' },
        { name: 'GREATER THAN OR EQUAL TO', value: '>=' },
        { name: 'LESS THAN OR EQUAL TO', value: '<=' }
    ];
    displayOperators: Array<any> = this.operators; //the operators which can change based on column selection

    sorts: Array<any> = [
        { name: 'Assending', value: 'ASC' },
        { name: 'Descending', value: 'DESC' }
    ];

    filterValueType: any = 'TEXT'; //the type of column selected (done because sqlite doesn't have a date type)

    /* the filter options formGroup to capture user input */
    filterOptions = new FormGroup({
        selectedFilter: new FormControl(), //the selected saved filter on the form
        defaultFilter: new FormControl(), //if the new filter being saved should be the default
        name: new FormControl(), //the new filters name
        column: new FormControl(), //the column to filter by
        operator: new FormControl(), //the operator to filter by
        value: new FormControl(), //the value to filter by
        type: new FormControl(), //the type of the column being filtered
        orderBy: new FormControl(), //what column to order by
        order: new FormControl() //what order to show notes in
    });

    constructor(public dialog: MatDialog, private _cs: CommonService,
        private _ss: SpaceService, private _ns: NoteService) { }

    setupSave(): void {
        let dialogRef = this.dialog.open(FilterSaveComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(() => {
        });

        dialogRef.componentInstance.filterNameSubmit.subscribe((filterData: any) => {
            this.filterOptions.controls.name.patchValue(filterData.filterName);
            this.filterOptions.controls.defaultFilter.patchValue(filterData.defaultFilter);
            this.saveFilter();
        });
    }

    savedFilters() {
        return (this._ss.data['filters'] && Object.keys(this._ss.data['filters'].length > 0));
    }

    showingSavedFilter() {
        return (this.filterOptions.controls.selectedFilter.value);
    }

    saveFilter() {
        console.log(this.filterOptions);
        this._ss.saveFilter(this.filterOptions.value)
            .subscribe(res => {
                if (res.status === 200) {

                } else {

                }
            });
    }

    filterValid() {
        let filterControls = this.filterOptions.controls;
        if (filterControls.column.value && filterControls.operator.value && filterControls.value.value) {
            return true;
        } else {
            return false;
        }
    }

    filterToggle() {
        let filterControls = this.filterOptions.controls;
        let selectedFilter = _.find(this._ss.data['filters'], { 'NAME': filterControls.selectedFilter.value });
        console.log(selectedFilter);
        filterControls.column.patchValue(selectedFilter.COLUMN);
        filterControls.operator.patchValue(selectedFilter.OPERATOR);
        filterControls.value.patchValue(selectedFilter.VALUE);
        let columnSelectionColumn = _.find(this._ss.data['column'], { 'name': selectedFilter.COLUMN });

        this._ss.filterNotes(this.filterOptions.value).subscribe(() => {
            this._ns.initNoteForms();
        });
    }

    applyFilters() {
        let filterControls = this.filterOptions.controls;
        let columnSelection = filterControls.column.value;
        let filterOptionsValue = this.filterOptions.value;
        let columnSelectionColumn = _.find(this._ss.data['column'], { 'name': columnSelection });

        this._ss.filterNotes(this.filterOptions.value).subscribe(() => {
            this._ns.initNoteForms();
        });
    }

    clearFilters() {
        let filterControls = this.filterOptions.controls;
        filterControls.selectedFilter.patchValue('');
        filterControls.column.patchValue('');
        filterControls.operator.patchValue('');
        filterControls.value.patchValue('');
        filterControls.type.patchValue('');
        filterControls.orderBy.patchValue('');
        filterControls.order.patchValue('');

        this._ss.getNotes().subscribe(() => {
            this._ns.initNoteForms();
        });
    }

    columnChange() {
        let filterControls = this.filterOptions.controls;
        let columnSelection = filterControls.column.value;
        let columnSelectionColumn = _.find(this._ss.data['columns'], { 'name': columnSelection });

        if (columnSelectionColumn.name.indexOf('DATE') >= 0) {
            this.displayOperators = this.operators;
            this.filterValueType = 'DATE';
        } else if (columnSelectionColumn.type === 'INTEGER') {
            this.displayOperators = this.operators;
            this.filterValueType = 'INT';
        } else if (columnSelectionColumn.type === 'TEXT' || columnSelectionColumn.type === 'BLOB') {
            this.displayOperators = _.filter(this.operators, function (operator) {
                return (operator.name === 'LIKE' || operator.name === 'EQUALS')
            });
            this.filterValueType = 'TEXT';
        }

        this.filterOptions.controls.type.patchValue(this.filterValueType);
    }

}

@Directive({
    selector: "[click-stop-propagation]"
})
export class ClickStopPropagation {
    @HostListener("click", ["$event"])
    public onClick(event: any): void {
        event.stopPropagation();
    }
}