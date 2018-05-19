import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {

    constructor() { }

    getDate(dateString) {
        return new Date(dateString);
    }

}
