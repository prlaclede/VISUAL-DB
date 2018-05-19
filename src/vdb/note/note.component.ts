import { ChangeDetectorRef, Component, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpaceService } from '../space/space.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';

@Component({
    selector: 'note',
    templateUrl: './note.html',
    styleUrls: ['./note.css'],
    providers: [NGXLogger]
})

export class NoteComponent {

    @Input() noteFG: FormGroup;
    @Input() noteProperties: Array<any>;

    constructor(private _spaceService: SpaceService, private logger: NGXLogger) {
    }

    ngOnInit() {
        console.log(this.noteFG);
        console.log(this.noteProperties);
    }

    saveNote(index) {
        // this.notesStatus['newNotes'][index]['saving'] = true;
        // this._spaceService.saveNote(this.newNotesFormGroup.controls[index].value)
        //     .subscribe(res => {
        //         if (res.status === 200) {
        //             this.notesStatus['newNotes'][index]['saving'] = false;
        //             this.deleteNewNote(index);
        //             this.loadNotes();
        //         } else {
        //             this.notesStatus['newNotes'][index]['saving'] = false;
        //         }
        //     });
    }

    updateNote(index) {
        // this.notesStatus['notes'][index]['saving'] = true;
        // this._spaceService.updateNote(this.notesFormGroup.controls[index].value)
        //     .subscribe(res => {
        //         if (res.status === 200) {
        //             this.notesStatus['notes'][index]['saving'] = false;
        //         } else {
        //             this.notesStatus['notes'][index]['saving'] = false;
        //         }
        //     });
    }

    deleteNewNote(index) {
        // this.newNotesFormGroup.removeControl(index);
        // this.newNoteIndex -= 1;
    }

    deleteSavedNote(index, noteId) {
        // console.log(index);
        // console.log(noteId);
        // this.notes = this.notes.splice(index, 1);
        // this.notesFormGroup.removeControl(noteId);
        // this._spaceService.archiveNote(noteId);
    }

    getDate(dateString) {
        return new Date(dateString);
    }

    ngOnDestroy(): void {
    }
}

//Visual DB
//Space
//Note
//Tag