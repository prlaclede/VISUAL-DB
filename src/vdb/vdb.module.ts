import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { VDBComponent } from './vdb.component';
import { MaterialModule } from './material/material.module';
import { SpaceService } from './space/space.service';

@NgModule({
  declarations: [
    VDBComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    MaterialModule
  ],
  providers: [
    SpaceService    
  ],
  bootstrap: [VDBComponent]
})
export class VDBModule { }
