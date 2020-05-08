import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as THREE from 'three';

import {CoreService} from '../core.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  objects: THREE.Mesh[] = this.coreService.objects;
  selectionType = this.coreService.options.selectionType;
  selectionTypes: string[] = ['vertex', 'edge', 'face', 'mesh'];

  constructor(
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
  }

  onChange(event) {
    this.coreService.options.selectionType = event;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.objects, event.previousIndex, event.currentIndex);
  }

  // TODO: Add Outline Selection from https://stemkoski.github.io/Three.js/Outline.html
  toggleWireframe(mesh: THREE.Mesh): void {
    const currentValue = mesh.visible;
    mesh.visible = !currentValue;
  }
}
