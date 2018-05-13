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
    return this._http.post('./api/note/save', note).map(res => {
      return res.json();
    });
  }

  updateNote(note) {
    return this._http.post('./api/note/update', note).map(res => {
      return res.json();
    });
  }
}
