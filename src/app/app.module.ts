import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainThreeComponent } from './main-three/main-three.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { SideBarComponent } from './main-three/side-bar/side-bar.component';
import { ViewportComponent } from './main-three/viewport/viewport.component';

import { CoreService } from './main-three/services/core.service';
import { SelectionService } from './main-three/services/selection.service';

@NgModule({
  declarations: [
    AppComponent,
    MainThreeComponent,
    SideBarComponent,
    ViewportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  exports: [],
  providers: [
    CoreService,
    SelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
