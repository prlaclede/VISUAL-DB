import { ChangeDetectorRef, Component } from '@angular/core';
import { SpaceService } from './space/space.service';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'visual-db',
  templateUrl: './vdb.component.html',
  styleUrls: ['./vdb.component.css']
})

export class VDBComponent {
  mobileQuery: MediaQueryList;
  title = 'Visual DB';

  private _mobileQueryListener: () => void;

  notes: Array<any>;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private _spaceService: SpaceService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    console.log('inits');
    this._spaceService.getNotes()
      .subscribe(res => this.notes = res);

    console.log(this.notes);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

//Visual DB
//Space
//Note
//Tag