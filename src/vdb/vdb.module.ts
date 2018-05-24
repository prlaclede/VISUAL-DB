import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { VDBComponent } from './vdb.component';
import { NoteComponent } from './note/note.component';
import { FilterComponent } from './filter/filter.component';
import { FilterSaveComponent } from './filter/filter.save.component';
import { MaterialModule } from './material/material.module';

import { SpaceService } from './space/space.service';
import { NoteService } from './note/note.service';
import { CommonService } from './common/common.service';

@NgModule({
  declarations: [
    VDBComponent,
    NoteComponent,
    FilterComponent, 
    FilterSaveComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    MaterialModule,
    LoggerModule.forRoot({serverLoggingUrl: '../logs', level: NgxLoggerLevel.DEBUG, serverLogLevel: NgxLoggerLevel.ERROR})
  ],
  providers: [
    SpaceService,
    NoteService,
    CommonService
  ],
  bootstrap: [VDBComponent]
})
export class VDBModule { }
