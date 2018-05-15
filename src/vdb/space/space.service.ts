import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class SpaceService {

  constructor(private _http: Http) { }

  getColumns() {
    return this._http.get('./api/columns').map(res => {
      return res.json();
    });
  }

  getNotes() {
    return this._http.get('./api/notes').map(res => {
      return res.json();
    });
  }

  saveNote(note) {
    console.log('saving note');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/note/save', note, options).map(res => {
      return res;
    });
  }

  updateNote(note) {
    console.log('updating note');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/note/update', note, options).map(res => {
      return res;
    });
  }

  archiveNote(noteId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/note/archive', noteId, options).map(res => {
      return res;
    });
  }
}
