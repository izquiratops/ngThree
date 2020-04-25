import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

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
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  renderer: THREE.WebGLRenderer = null;
  mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  controls: OrbitControls = null;
  stats: Stats = Stats();
  gui: GUI = new GUI();

  objects: Array<THREE.Group> = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  private createInstance(input: InstanceObject): THREE.Group {
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
    const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const wireframeMesh = new THREE.Mesh(input.geometry, wireframeMat);
    wireframeMesh.name = 'Wireframe';
    wireframeMesh.visible = this.options.Wireframe;
    group.add(wireframeMesh);

    // Set position & Add into Scene
    group.position.x = input.x_position;
    this.scene.add(group);

    return group
  }

  private render(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersection = this.raycaster.intersectObject(this.objects[0].children[0]);

    if (intersection.length > 0) {
      console.debug('Intersection!', intersection);
    }

    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  ngAfterViewInit(): void {
    /**
     * Setup Canvas + Controls + Camera
     */
    this.canvas = <HTMLCanvasElement>this.canvasElement.nativeElement;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(2, 2, 3);
    this.camera.lookAt(0, 0, 0);

    // Stats + GUI
    document.body.appendChild(this.stats.dom);

    this.gui.add(this.options, 'Wireframe').onChange(() => {
      this.objects.forEach(element => {
        const found = element.children.find(child => child.name === "Wireframe");
        found.visible = this.options.Wireframe
      });
    });

    /**
     * Setup Geometry and Lighting
     */
    const newObj: InstanceObject = {
      geometry: new THREE.BoxGeometry,
      color: 0x44aa88,
      x_position: 0
    }
    this.objects.push(this.createInstance(newObj));

    const light: THREE.DirectionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, 2, 4);
    this.scene.add(light);

    requestAnimationFrame(this.render.bind(this));
  }
}
