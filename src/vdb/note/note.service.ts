import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

import { SpaceService } from '../space/space.service';
import { CommonService } from '../common/common.service';

@Injectable()
export class NoteService {

    constructor(private _http: Http, private _cs: CommonService, private _ss: SpaceService) { }

    newNoteIndex: number; //an index of new notes added to the form
    notesFormGroup = new FormGroup({}); //a formGroup for all the notes on the page
    newNotesFormGroup = new FormGroup({}); //a formGroup for all the new notes on the page

    notes: Array<any>; //a list of notes loaded from the DB, used some orderBy can be maintained
    noteProperties: Array<any>; //a list of objects containing various note status (saving, etc...)

    initNoteForms(notes) {
        this.newNoteIndex = 1;
        this.noteProperties = new Array();
        this.noteProperties['notes'] = new Array();
        this.noteProperties['newNotes'] = new Array();

        this.notes = notes;
        this.notesFormGroup = new FormGroup({});

        _.each(notes, (note) => {
            this.noteProperties['notes'][note.ID] = new Array();
            this.noteProperties['notes'][note.ID]['saving'] = false;
            this.notesFormGroup.controls[note.ID] = new FormGroup({
                ID: new FormControl(note.ID),
                DATE: new FormControl(this._cs.getDate(note.DATE)),
                TITLE: new FormControl(note.TITLE),
                NOTE: new FormControl(note.NOTE),
                PARENT: new FormControl(note.PARENT)
            });
        });

        let notesTree = this.makeNotesTree(notes);
    }

    makeNotesTree(notes) {
        var groupedNotes = _.groupBy(notes, 'PARENT');
        _.each(_.omit(groupedNotes, ['', 'null']), (children, parentId) => {
            let parentNoteFormGroup = this.notesFormGroup.controls[parentId]['controls'];
            parentNoteFormGroup['children'] = new FormGroup({});
            
            _.each(children, (child) => {
                parentNoteFormGroup['children'].controls[child.ID] = this.notesFormGroup.controls[child.ID];
                this.notesFormGroup.removeControl(child.ID);
            });
        });

        console.log(this.notesFormGroup);
        return groupedNotes;
    }

    getNotesArray(controlGroup) {
        return Object.keys(controlGroup.controls);
    }

    addNote() {
        this.noteProperties['newNotes'][this.newNoteIndex] = new Array();
        this.noteProperties['newNotes'][this.newNoteIndex]['saving'] = false;
        this.newNotesFormGroup.controls[this.newNoteIndex] = new FormGroup({
            ID: new FormControl(this.newNoteIndex),
            DATE: new FormControl(new Date()),
            TITLE: new FormControl(),
            NOTE: new FormControl(),
            PARENT: new FormControl()
        });

        this.newNoteIndex += 1;
    }

    saveNote(index) {
        let newNoteValue = this.newNotesFormGroup.controls[index].value;
        console.log(newNoteValue);
        this.noteProperties['newNotes'][index]['saving'] = true;
        this._ss.saveNote(newNoteValue)
            .subscribe(res => {
                if (res.status === 200) {
                    let noteId = JSON.parse(res['_body'])[0];
                    this.noteProperties['newNotes'][index]['saving'] = false;
                    this.deleteNewNote(index);
                    /* add to the notes FormGroup */
                    this.notesFormGroup.controls[noteId] = new FormGroup({
                        ID: new FormControl(noteId),
                        DATE: new FormControl(this._cs.getDate(newNoteValue.DATE)),
                        TITLE: new FormControl(newNoteValue.TITLE),
                        NOTE: new FormControl(newNoteValue.NOTE),
                        PARENT: new FormControl(newNoteValue.PARENT)
                    });
                    /* add to the noteProperties array */
                    this.noteProperties['notes'][noteId] = new Array();
                    this.noteProperties['notes'][noteId]['saving'] = false;
                    /* add to the notes array */
                    let newNoteObj = {
                        ID: noteId,
                        DATE: newNoteValue.DATE,
                        TITLE: newNoteValue.TITLE,
                        NOTE: newNoteValue.NOTE,
                        PARENT: newNoteValue.PARENT
                    }

                    // if () {
                    //     this.notes.push(newNoteObj);
                    // } else {
                    this.notes.unshift(newNoteObj);
                    // }
                    console.log(this.noteProperties);
                } else {
                    this.noteProperties['newNotes'][index]['saving'] = false;
                }
            });
    }

    updateNote(index) {
        console.log(index);
        this.noteProperties['notes'][index]['saving'] = true;
        this._ss.updateNote(this.notesFormGroup.controls[index].value)
            .subscribe(res => {
                if (res.status === 200) {
                    this.noteProperties['notes'][index]['saving'] = false;
                } else {
                    this.noteProperties['notes'][index]['saving'] = false;
                }
            });
    }

    deleteNewNote(noteId) {
        this.newNotesFormGroup.removeControl(noteId);
        this.newNoteIndex -= 1;
    }

    deleteSavedNote(noteId) {
        let noteIndex = _.findKey(this.notes, { ID: noteId });
        this.notes.splice(noteIndex, 1);
        this.notesFormGroup.removeControl(noteId);
        this._ss.archiveNote(noteId);
    }

}
