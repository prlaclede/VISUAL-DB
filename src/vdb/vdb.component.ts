import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SpaceService } from './space/space.service';
import { MediaMatcher } from '@angular/cdk/layout';
import * as _ from 'lodash';

@Component({
  selector: 'visual-db',
  templateUrl: './vdb.component.html',
  styleUrls: ['./vdb.component.css']
})

export class VDBComponent {
  mobileQuery: MediaQueryList;
  title = 'Visual DB';

  private _mobileQueryListener: () => void;

  notes: Array<any>;
  filteredNotes: Array<any>;
  columns: Array<any>;

  operators: Array<any> = [
    { name: 'LIKE', value: 'lk' },
    { name: 'EQUALS', value: 'eq' },
    { name: 'GREATER THAN', value: 'gt' },
    { name: 'LESS THAN', value: 'lt' },
    { name: 'GREATER THAN OR EQUAL TO', value: 'gtoeq' },
    { name: 'LESS THAN OR EQUAL TO', value: 'ltoeq' }
  ];
  displayOperators: Array<any> = this.operators;

  filterValueType: any = 'TEXT';

  filterOptions = new FormGroup({
    column: new FormControl(),
    operator: new FormControl(),
    value: new FormControl()
  });

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _spaceService: SpaceService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    console.log('init');
    this._spaceService.getColumns().subscribe(columns => {
      console.log(columns);
      this.columns = columns;
    });

    this._spaceService.getNotes().subscribe(notes => {
      console.log(notes);
      this.notes = notes;
      this.filteredNotes = notes;
    });
  }

  applyFilters() {
    console.log('applying filters');
    let filterControls = this.filterOptions.controls;
    let columnSelection = filterControls.column.value;
    let operatorSelection = filterControls.operator.value;
    let valueSelection = filterControls.value.value;

    let columnSelectionColumn = _.find(this.columns, { 'name': columnSelection });

    this.filteredNotes = _.each(this.notes, function (note) {
      let notes = Array<any>();
      console.log(operatorSelection);

      if (operatorSelection === 'lk' && (note[columnSelection].indexOf(valueSelection) >= 0)) {
        notes.push(note);
      } else if (operatorSelection === 'eq' && note[columnSelection] === (valueSelection) >= 0) {
        notes.push(note);
      } else if (operatorSelection === 'gt' && note[columnSelection] > (valueSelection)) {
        notes.push(note);
      } else if (operatorSelection === 'lt' && note[columnSelection] < (valueSelection)) {
        notes.push(note);
      } else if (operatorSelection === 'gtoeq' && note[columnSelection] >= (valueSelection)) {
        notes.push(note);
      } else if (operatorSelection === 'ltoeq' && note[columnSelection] <= (valueSelection)) {
        notes.push(note);
      }

      return this.notes;
    });
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
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

//Visual DB
//Space
//Note
//Tag