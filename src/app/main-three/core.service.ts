import { Injectable } from '@angular/core';
import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {HelperObjects} from './interfaces/helperObjects';

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
    selectionType: 'face',
    wireframe: true,
    wireframeColor: 0x00FF00,
    wireframeLinewidth: 3,
  };

  objects: Array<THREE.Mesh> = [];
  helperObjects: HelperObjects = {
    triangle: null,
    grid: null,
    axes: null,
  };

  constructor() { }

  createLabel(label: string, translation = new THREE.Matrix4().makeTranslation(0, 0, 0)) {
    const tagDiv = document.createElement( 'label' );
    tagDiv.className = label;
    tagDiv.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    tagDiv.style.borderRadius = '6px';
    tagDiv.style.marginTop = '-1em';
    tagDiv.style.padding = '0.5em';
    tagDiv.style.color = '#FF1654';
    tagDiv.style.background = 'rgba(178, 219, 191, 0.5)';

    const tagLabel = new CSS2DObject( tagDiv );

    return tagLabel;
  }

  createInstance(geometry: THREE.BufferGeometry, name: string,
                 translation = new THREE.Matrix4().makeTranslation(0, 0, 0)): THREE.Mesh {
    const material = new THREE.MeshNormalMaterial({
      wireframe: false,
      wireframeLinewidth: this.options.wireframeLinewidth,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const newObject = new THREE.Mesh(geometry, material);
    newObject.name = name;
    newObject.applyMatrix4(translation);
    newObject.add(this.createLabel(name, translation));

    this.objects.push(newObject);
    return newObject;
  }

  createTriangle(): THREE.Line {
    const triangleGeo = new THREE.BufferGeometry();
    triangleGeo.setAttribute('position',
      new THREE.BufferAttribute(new Float32Array( 4 * 3 ), 3 ));
    const triangleMat = new THREE.LineBasicMaterial({
      color: this.options.wireframeColor,
      linewidth: this.options.wireframeLinewidth,
      transparent: true,
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

  createAxes(): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper( 0.5 );
    (axesHelper.material as THREE.LineBasicMaterial).linewidth = 4;

    this.helperObjects.axes = axesHelper;
    return axesHelper;
  }
}
