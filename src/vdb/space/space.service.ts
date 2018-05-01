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
}
