import { ChangeDetectorRef, Component, Input, Pipe, PipeTransform, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SpaceService } from './space/space.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';

@Component({
  selector: 'visual-db',
  templateUrl: './vdb.component.html',
  styleUrls: ['./vdb.component.css'],
  providers: [NGXLogger]
})

export class VDBComponent {
  mobileQuery: MediaQueryList;
  title = 'Visual DB';

  private _mobileQueryListener: () => void;

  notes: Array<any>; //a list of notes loaded from the DB, used some orderBy can be maintained
  newNoteElementReference: Array<any>; //a list of elements used to set focus on adding of a new note
  notesStatus: Array<any>; //a list of objects containing various note status (saving, etc...)
  columns: Array<any>; //a list of column present in the current space

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

  newNoteIndex: number = 0; //an index of new notes added to the form
  notesFormGroup = new FormGroup({}); //a formGroup for all the notes on the page
  newNotesFormGroup = new FormGroup({}); //a formGroup for all the new notes on the page

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _spaceService: SpaceService,
    private fb: FormBuilder, private logger: NGXLogger) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    let noteId = event.target['attributes'].noteId || event.target['attributes'].newNoteId;
    let newNote = event.target['attributes'].newNote;
    if (key === 'Enter' && event.ctrlKey && noteId !== undefined) {
      let noteIdValue = noteId.value;

      if (newNote !== undefined) {
        this.saveNote(noteIdValue);
      } else {
        this.updateNote(noteIdValue);
      }
    } else if (key === 'i' && event.ctrlKey) {
      this.addNote();
    }
  }

  ngOnInit() {
    this.newNoteIndex = 0;
    this.notesStatus = new Array();
    this.notesStatus['notes'] = new Array();
    this.notesStatus['newNotes'] = new Array();

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
    this._spaceService.getColumns().subscribe(columns => {
      this.columns = columns;
    });
  }

  loadNotes() {
    this._spaceService.getNotes().subscribe(notes => {
      this.initNoteForms(notes);
    });
  }

  initNoteForms(notes) {
    this.notes = notes;
    this.notesFormGroup = new FormGroup({});
    console.log(notes);
    _.each(notes, (note) => {
      this.notesStatus['notes'][note.ID] = new Array();
      this.notesStatus['notes'][note.ID]['saving'] = false;
      this.notesFormGroup.controls[note.ID] = new FormGroup({
        ID: new FormControl(note.ID),
        DATE: new FormControl(this.getDate(note.DATE)),
        TITLE: new FormControl(note.TITLE),
        NOTE: new FormControl(note.NOTE)
      });
    });
    console.log(this.notesFormGroup.controls);
  }

  addNote() {
    this.notesStatus['newNotes'][this.newNoteIndex] = new Array();
    this.notesStatus['newNotes'][this.newNoteIndex]['saving'] = false;
    this.newNotesFormGroup.controls[this.newNoteIndex] = new FormGroup({
      DATE: new FormControl(new Date()),
      TITLE: new FormControl(),
      NOTE: new FormControl()
    });

    this.newNoteIndex += 1;
  }

  saveNote(index) {
    this.notesStatus['newNotes'][index]['saving'] = true;
    this._spaceService.saveNote(this.newNotesFormGroup.controls[index].value)
      .subscribe(res => {
        if (res.status === 200) {
          this.notesStatus['newNotes'][index]['saving'] = false;
          this.deleteNewNote(index);
          this.loadNotes();
        } else {
          this.notesStatus['newNotes'][index]['saving'] = false;
        }
      });
  }

  updateNote(index) {
    this.notesStatus['notes'][index]['saving'] = true;
    this._spaceService.updateNote(this.notesFormGroup.controls[index].value)
      .subscribe(res => {
        if (res.status === 200) {
          this.notesStatus['notes'][index]['saving'] = false;
        } else {
          this.notesStatus['notes'][index]['saving'] = false;
        }
      });
  }

  deleteNewNote(index) {
    this.newNotesFormGroup.removeControl(index);
    this.newNoteIndex -= 1;
  }

  deleteSavedNote(index, noteId) {
    console.log(index);
    console.log(noteId);
    this.notes = this.notes.splice(index, 1);
    this.notesFormGroup.removeControl(noteId);
    this._spaceService.archiveNote(noteId);
  }

  getDate(dateString) {
    return new Date(dateString);
  }

  getNotesArray(controlGroup) {
    return Object.keys(controlGroup.controls);
  }

  applyFilters() {
    let filterControls = this.filterOptions.controls;
    let columnSelection = filterControls.column.value;
    let filterOptionsValue = this.filterOptions.value;
    let columnSelectionColumn = _.find(this.columns, { 'name': columnSelection });

    this._spaceService.filterNotes(this.filterOptions.value).subscribe(filteredNotes => {
      this.initNoteForms(filteredNotes);
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
    let columnSelectionColumn = _.find(this.columns, { 'name': columnSelection });

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

  formatString() {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

//Visual DB
//Space
//Note
//Tag