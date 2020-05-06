import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as THREE from 'three';

import {CoreService} from '../core.service';
import {ItemObjList} from '../interfaces/itemObjList';
import {SelectionTypes} from '../interfaces/selectionTypes';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  objects: Array<ItemObjList> = [];
  selectionType: string;
  selectionTypes: string[] = ['vertex', 'edge', 'face', 'mesh'];

  constructor(
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this.objects = this.coreService.objects;
    this.selectionType = this.coreService.options.selectionType;
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
