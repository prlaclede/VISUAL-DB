import { ChangeDetectorRef, Component, Input, HostListener, ElementRef } from '@angular/core';
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

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private logger: NGXLogger,
    private _cs: CommonService, private _ss: SpaceService, private _ns: NoteService) {
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
        parent.querySelector('.saveButton[noteId="' + noteId.value + '"]').click();
      } else if (key === 'Tab' && event.ctrlKey && noteId !== undefined) {

      }
    }
  }

  ngOnInit() {
    this._ss.getColumns().subscribe();

    this._ss.getNotes().subscribe(() => {
      this._ns.initNoteForms();
    });

    this._ss.getFilters().subscribe();
  }

  ngAfterContentChecked() {
    if (document.querySelector('.newNote')) {
      var noteTextArea = document.querySelector('.newNote');
      document.getElementById(noteTextArea.id).focus();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}