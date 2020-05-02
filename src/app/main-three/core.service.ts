import { Injectable } from '@angular/core';
import * as THREE from "three";
import {HelperObjects} from "./interfaces/helperObjects";

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private _options = {
    wireframe: true,
  };
  private _objects: Array<THREE.Mesh> = [];
  private _helperObjects: HelperObjects = {
    triangle: null,
    grid: null,
  };

  constructor() { }

  createInstance(geometry: THREE.BufferGeometry): THREE.Mesh {
    const material = new THREE.MeshNormalMaterial({
      wireframe: false,
      wireframeLinewidth: 3,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const newObject = new THREE.Mesh(geometry, material);

    this.objects.push(newObject);
    return newObject;
  }

  createTriangle(): THREE.Line {
    const triangleGeo = new THREE.BufferGeometry();
    triangleGeo.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array( 4 * 3 ),3 ));
    const triangleMat = new THREE.LineBasicMaterial({
      color: 0x00FF00,
      transparent: true,
      linewidth: 3
    });
    const triangle = new THREE.Line(triangleGeo, triangleMat);

    this._helperObjects.triangle = triangle;
    return triangle;
  }

  createGrid(): THREE.GridHelper {
    const grid = new THREE.GridHelper( 10, 20 );

    this._helperObjects.grid = grid;
    return grid;
  }

  get options(): { wireframe: boolean } {
    return this._options;
  }

  set options(value: { wireframe: boolean }) {
    this._options = value;
  }

  get objects(): Array<THREE.Mesh> {
    return this._objects;
  }

  set objects(value: Array<THREE.Mesh>) {
    this._objects = value;
  }

  get helperObjects(): HelperObjects {
    return this._helperObjects;
  }

  set helperObjects(value: HelperObjects) {
    this._helperObjects = value;
  }
}
