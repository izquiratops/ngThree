import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainThreeComponent } from './main-three/main-three.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';

import { SideBarComponent } from './main-three/side-bar/side-bar.component';
import { ViewportComponent } from './main-three/viewport/viewport.component';

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
    // FormsModule,
    // ReactiveFormsModule,
    DragDropModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    // MatInputModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
