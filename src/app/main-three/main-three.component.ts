import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

// Imports for future implementations
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Stats from 'three/examples/jsm/libs/stats.module'
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

@Component({
  selector: 'main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', {static: false}) canvasElement: ElementRef;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor() { }

  ngOnInit(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  }

  ngAfterViewInit(): void {
    this.renderer = new THREE.WebGLRenderer({canvas: <HTMLCanvasElement>this.canvasElement.nativeElement, antialias: true, alpha: false});
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    // Setup Scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );

    this.camera.position.z = 5;
    this.renderer.render( this.scene, this.camera );
  }

}
