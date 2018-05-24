import { Component, Inject } from '@angular/core';
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
        column: new FormControl(),
        operator: new FormControl(),
        value: new FormControl(),
        type: new FormControl(),
        orderBy: new FormControl(),
        order: new FormControl()
    });

    constructor(public dialog: MatDialog, private _cs: CommonService,
        private _ss: SpaceService, private _ns: NoteService) { }

    setupSave(): void {
        let dialogRef = this.dialog.open(FilterSaveComponent, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
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

    applyFilters() {
        let filterControls = this.filterOptions.controls;
        let columnSelection = filterControls.column.value;
        let filterOptionsValue = this.filterOptions.value;
        let columnSelectionColumn = _.find(this._ss.columns, { 'name': columnSelection });

        this._ss.filterNotes(this.filterOptions.value).subscribe(filteredNotes => {
            this._ns.initNoteForms(filteredNotes);
        });
    }

    clearFilters() {
        let filterControls = this.filterOptions.controls;
        filterControls.column.patchValue('');
        filterControls.operator.patchValue('');
        filterControls.value.patchValue('');
        filterControls.type.patchValue('');
        filterControls.orderBy.patchValue('');
        filterControls.order.patchValue('');

        this.loadNotes();
    }

    loadNotes() {
        this._ss.getNotes().subscribe(notes => {
            this._ns.notes = notes;
            this._ns.initNoteForms(notes);
        });
    }

    columnChange() {
        let filterControls = this.filterOptions.controls;
        let columnSelection = filterControls.column.value;
        let columnSelectionColumn = _.find(this._ss.columns, { 'name': columnSelection });

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