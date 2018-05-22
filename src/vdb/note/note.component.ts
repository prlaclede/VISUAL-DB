import { ChangeDetectorRef, Component, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';

import { SpaceService } from '../space/space.service';
import { NoteService } from '../note/note.service';
import { CommonService } from '../common/common.service';

@Component({
    selector: 'note',
    templateUrl: './note.html',
    styleUrls: ['./note.css'],
    providers: [NGXLogger]
})

export class NoteComponent {

    @Input() noteFG: FormGroup;
    @Input() noteProperties: Array<any>;
    @Input() newNote: boolean;
    @Input() parent: number;
    @Input() isChild: boolean;

    noteAttributes: any;
    
    constructor(private logger: NGXLogger, private _cs: CommonService, private _ss: SpaceService, private _ns: NoteService) {
    }

    ngOnInit() {
        this.noteAttributes = this.noteFG.controls;
        this.noteFG.controls.PARENT.patchValue(this.parent);
    }

    ngOnDestroy(): void {
    }
}

//Visual DB
//Space
//Note
//Tag