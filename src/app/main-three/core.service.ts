import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {ItemObjList} from './interfaces/itemObjList';
import {HelperObjects} from './interfaces/helperObjects';
import {Subject} from 'rxjs';

enum objectType {
  mesh = 'mesh',
  camera = 'camera',
  light = 'light'
}

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  options = {
    wireframe: true,
    wireframeColor: 0x00FF00,
    wireframeLinewidth: 3,
  };

  objects: Array<ItemObjList> = [];
  // objects$: Subject<Array<ItemObjList>> = new Subject<Array<ItemObjList>>();
  helperObjects: HelperObjects = {
    triangle: null,
    grid: null,
  };

  constructor() { }

  createInstance(geometry: THREE.BufferGeometry, name: string): THREE.Mesh {
    const material = new THREE.MeshNormalMaterial({
      wireframe: false,
      wireframeLinewidth: this.options.wireframeLinewidth,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const newObject = new THREE.Mesh(geometry, material);
    newObject.name = name;

    this.objects.push({mesh: newObject, type: objectType.mesh});
    return newObject;
  }

  createTriangle(): THREE.Line {
    const triangleGeo = new THREE.BufferGeometry();
    triangleGeo.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array( 4 * 3 ), 3 ));
    const triangleMat = new THREE.LineBasicMaterial({
      color: this.options.wireframeColor,
      transparent: true,
      linewidth: this.options.wireframeLinewidth,
    });
    const triangle = new THREE.Line(triangleGeo, triangleMat);

    this.helperObjects.triangle = triangle;
    return triangle;
  }

  createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper( 10, 20 );

    this.helperObjects.grid = grid;
    return grid;
  }
}
