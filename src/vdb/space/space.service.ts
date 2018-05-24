import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { CommonService } from '../common/common.service';

@Injectable()
export class SpaceService {

  constructor(private _http: Http) { }

  data = new Array<any>();

  getColumns() {
    return this._http.get('./api/columns').map(res => {
      this.data['columns'] = new Array<any>();
      console.log(res.json());
      this.data['columns'] = res.json();
    });
  }

  getNotes() {
    return this._http.get('./api/notes').map(res => {
      this.data['notes'] = new Array<any>();
      this.data['notes'] = res.json();
    });
  }

  getFilters() {
    return this._http.get('./api/filters').map(res => {
      this.data['filters'] = new Array<any>();
      console.log(res.json());
      this.data['filters'] = res.json();
    });
  }

  filterNotes(filter) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/filterNotes', filter, options).map(res => {
      this.data['notes'] = res.json();
    });
  }

  saveNote(note) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/note/save', note, options).map(res => {
      return res;
    });
  }

  updateNote(note) {
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

  saveFilter(filter) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/filter/save', filter, options).map(res => {
      return res;
    });
  }

  deleteFilter(filterId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('./api/filter/archive', filterId, options).map(res => {
      return res;
    });
  }
}
