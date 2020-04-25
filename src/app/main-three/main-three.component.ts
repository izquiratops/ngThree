import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

// Interfaces
import { InstanceObject } from './objectInstance';

@Component({
  selector: 'main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false }) canvasElement: ElementRef;
  canvas: HTMLCanvasElement;

  options = {
    'Wireframe': true,
    'Autorotation': true,
  }

  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  stats: Stats = Stats();
  gui: GUI = new GUI();

  objects: Array<THREE.Group> = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  private createInstance(input: InstanceObject) {
    const group = new THREE.Group();

    // Color Material Mesh
    const material = new THREE.MeshPhongMaterial({
      color: input.color,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const colorMesh = new THREE.Mesh(input.geometry, material);
    colorMesh.name = 'Color';
    group.add(colorMesh);

    // Wireframe Mesh
    const wiremat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const wireframeMesh = new THREE.Mesh(input.geometry, wiremat);
    wireframeMesh.name = 'Wireframe';
    wireframeMesh.visible = this.options.Wireframe;
    group.add(wireframeMesh);

    // Set position & Add into Scene
    group.position.x = input.x_position;
    this.scene.add(group);

    return group
  }

  private resizeRendererToDisplaySize(): boolean {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const needResize = this.canvas.width !== width || this.canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }

    return needResize
  }

  private render(): void {
    if (this.resizeRendererToDisplaySize()) {
      console.debug('Resizing!');
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    }

    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement>this.canvasElement.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // Camera + Controls
    this.camera.position.set(0, 0, 3);
    this.controls = new OrbitControls(this.camera, this.canvas);

    // Setup Geometry
    const newObj: InstanceObject = {
      geometry: new THREE.BoxGeometry,
      color: 0x44aa88,
      x_position: 0
    }
    this.objects.push(this.createInstance(newObj));

    // Setup lighting
    const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, 2, 4);
    this.scene.add(light);

    // Stats
    document.body.appendChild(this.stats.dom);

    // Top-right panel
    this.gui.add(this.options, 'Wireframe').onChange(() => {
      this.objects.forEach(element => {
        const found = element.children.find(child => child.name === "Wireframe");
        found.visible = this.options.Wireframe
      });
    });

    requestAnimationFrame(this.render.bind(this));
  }
}
