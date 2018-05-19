import { ChangeDetectorRef, Component, Input, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';

import { NoteComponent } from './note/note.component';

import { SpaceService } from './space/space.service';
import { NoteService } from './note/note.service';
import { CommonService } from './common/common.service';

@Component({
  selector: 'visual-db',
  templateUrl: './vdb.html',
  styleUrls: ['./vdb.css'],
  providers: [NGXLogger]
})

export class VDBComponent {
  mobileQuery: MediaQueryList;
  title = 'Visual DB';

  private _mobileQueryListener: () => void;

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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private fb: FormBuilder, private logger: NGXLogger,
    private _cs: CommonService, private _ss: SpaceService, private _ns: NoteService, ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    let targetElement = event.target;
    let parent = targetElement['closest']('[noteId]');
    
    if (key === 'i' && event.ctrlKey) {
      this._ns.addNote();
    }

    if (parent) {
      let noteId = parent['attributes'].noteId || parent['attributes'].newNoteId;
      let newNote = parent['attributes'].newNote.value;
      if (key === 'Enter' && event.ctrlKey && noteId !== undefined) {
        let noteIdValue = noteId.value;

        if (newNote === 'true') {
          this._ns.saveNote(noteIdValue);
        } else {
          this._ns.updateNote(noteIdValue);
        }
      }
    }
  }

  ngOnInit() {
    this.loadColumns();

    this.loadNotes();
  }

  ngAfterContentChecked() {
    if (document.querySelector('.newNote')) {
      var noteTextArea = document.querySelector('.newNote');
      document.getElementById(noteTextArea.id).focus();
    }
  }

  loadColumns() {
    this._ss.getColumns().subscribe(columns => {
      this._ss.columns = columns;
    });
  }

  loadNotes() {
    this._ss.getNotes().subscribe(notes => {
      this._ns.notes = notes;
      this._ns.initNoteForms(notes);
    });
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

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}