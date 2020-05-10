import { Component } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as THREE from 'three';

import {CoreService} from '../services/core.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  objects: THREE.Mesh[] = this.coreService.objects;
  selectionType = this.coreService.options.selectionType;
  selectionTypes: string[] = ['face', 'mesh'];

  constructor(
    private coreService: CoreService,
  ) { }

  onChange(value) {
    this.coreService.options.selectionType = value;
    this.coreService.selectionType$.next();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.objects, event.previousIndex, event.currentIndex);
  }

  toggleVisibility(mesh: THREE.Mesh): void {
    const currentValue = mesh.visible;
    mesh.visible = !currentValue;
    this.coreService.render$.next();
  }
}
