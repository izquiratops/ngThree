import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import * as THREE from 'three';

import {CoreService} from '../core.service';
import {ItemObjList} from '../interfaces/itemObjList';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  objects: Array<ItemObjList> = [];

  constructor(
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this.objects = this.coreService.objects;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.objects, event.previousIndex, event.currentIndex);
  }

  editName(mesh: THREE.Mesh) {
    (mesh.material as THREE.MeshNormalMaterial).name = 'woo';
  }

  toggleWireframe(mesh: THREE.Mesh) {
    const currentValue = (mesh.material as THREE.MeshNormalMaterial).wireframe;
    (mesh.material as THREE.MeshNormalMaterial).wireframe = !currentValue;
  }
}
