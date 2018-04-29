import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class SpaceService {

  constructor(private _http: Http) { }

  result: any;
  
  getNotes() {
    return this._http.get('./api/notes')
      .map(result => this.result = result.json().data);
  }
}
