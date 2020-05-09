import { Component, ElementRef, ViewChild, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { CoreService } from '../services/core.service';
import { SelectionService } from '../services/selection.service';

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false }) canvasElement: ElementRef;
  canvas: HTMLCanvasElement;
  statsEnabled = false;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;

  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  controls: OrbitControls;
  stats: Stats;

  constructor(
    private coreService: CoreService,
    private selectionMethods: SelectionService,
  ) {
  }

  ngOnInit(): void {
    // Core elements
    this.scene = new THREE.Scene();

    // Interaction objs
    this.mouse = new THREE.Vector2(1, 1);
    this.raycaster = new THREE.Raycaster();

    // Debug stats
    if (this.statsEnabled) {
      this.stats = Stats();
      document.body.appendChild(this.stats.dom);
    }

    // Setup Initial Objects
    this.scene.add(this.coreService.createTriangle());
    this.scene.add(this.coreService.createGrid());
    this.scene.add(this.coreService.createAxes());

    const initTrans = new THREE.Matrix4().makeTranslation(0, 0, 0);
    const initCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'Init Cube', initTrans);
    this.scene.add(initCube);

    console.debug('Objects Array', this.coreService.objects);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  // Left-Click mouse Event
  onMouseDown(event) {
    if (event.button === 0) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersections = this.raycaster.intersectObjects(this.coreService.objects);
      if (intersections.length > 0) {
        switch (this.coreService.options.selectionType) {
          case 'vertex':
            this.selectionMethods.selectingVertex(intersections);
            break;
          case 'edge':
            this.selectionMethods.selectingEdge(intersections);
            break;
          case 'face':
            this.selectionMethods.selectingFace(intersections);
            break;
          case 'mesh':
            this.selectionMethods.selectingMesh(intersections);
            break;
        }
      }
    }
  }

  // Key A Event
  @HostListener('document:keydown.a', [])
  onKeydownHandler() {
    // TODO: There's no such a thing like 'selection' implemented yet, just a sad sad triangle
    const triangle = this.coreService.helperObjects.find(element => element.name === 'triangleHelper');
    triangle.visible = false;
  }

  ngAfterViewInit(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: (this.canvasElement.nativeElement as HTMLCanvasElement),
      antialias: true,
      alpha: true
    });

    this.canvas = this.renderer.domElement;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(2, 2, 3);
    this.camera.lookAt(0, 0, 0);

    this.labelRenderer = new CSS2DRenderer();
    // this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(this.labelRenderer.domElement);

    requestAnimationFrame(this.render.bind(this));
  }

  private render(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.labelRenderer.setSize(width, height);
      this.renderer.setSize(width, height, false);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    if (this.statsEnabled) this.stats.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
