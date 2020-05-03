import { Component, OnInit } from '@angular/core';
import {CoreService} from '../core.service';
import * as THREE from 'three';
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

  toggleWireframe(mesh: THREE.Mesh) {
    const currentValue = (mesh.material as THREE.MeshNormalMaterial).wireframe;
    (mesh.material as THREE.MeshNormalMaterial).wireframe = !currentValue;
  }
}
