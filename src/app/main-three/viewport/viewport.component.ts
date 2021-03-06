import { Component, ElementRef, ViewChild, HostListener, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CoreService } from '../services/core.service';
import { SelectionService } from '../services/selection.service';

import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
// import Stats from 'three/examples/jsm/libs/stats.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: false }) canvasElement: ElementRef;
  canvas: HTMLCanvasElement;
  subscription: Subscription = new Subscription();

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  labelRenderer: CSS2DRenderer;

  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  orbit: OrbitControls;
  gizmo: TransformControls;

  constructor(
    private coreService: CoreService,
    private selectionMethods: SelectionService,
  ) {
    this.subscription
      .add(this.coreService.render$.subscribe(() => this.render()))
      .add(this.coreService.selectionType$.subscribe(() => this.onUnselect()));
  }

  ngOnInit(): void {
    // Core elements
    this.scene = new THREE.Scene();

    // Interaction objs
    this.mouse = new THREE.Vector2(1, 1);
    this.raycaster = new THREE.Raycaster();

    // Setup Initial Objects
    this.scene.add(this.coreService.createTriangle());
    this.scene.add(this.coreService.createGrid());
    this.scene.add(this.coreService.createAxes());

    const origin = new THREE.Matrix4().makeTranslation(0, 0, 0);
    const initCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'Init Cube', origin);
    this.scene.add(initCube);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  onMouseDown(event) {
    if (event.button === 0) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersections = this.raycaster.intersectObjects(this.coreService.objects);
      if (intersections.length > 0) {
        switch (this.coreService.options.selectionType) {
          case 'face':
            this.selectionMethods.selectingFace(intersections);
            break;
          case 'mesh':
            this.selectionMethods.selectingMesh(intersections, this.gizmo);
            break;
        }
      }
      this.render();
    }
  }

  // Debug Log of the current Scene
  @HostListener('document:keydown.alt.q', [])
  showSceneLog() {
    console.debug(this.scene);
  }

  @HostListener('document:keydown.a', [])
  onUnselect() {
    const triangle = this.coreService.helperObjects
      .find(element => element.name === 'triangleHelper');
    if (triangle) triangle.visible = false;

    const selectedObject = this.gizmo.object;
    if (selectedObject) {
      const label = selectedObject.children.find(element => element.name === 'objectLabel');
      selectedObject.remove(label);
      this.gizmo.detach();
    }

    this.render();
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.labelRenderer.setSize(width, height);

    this.render();
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasElement.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);

    this.orbit = new OrbitControls(this.camera, this.canvas);
    this.orbit.update();

    // TODO: Snap on grid
    // https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_transform.html
    this.gizmo = new TransformControls(this.camera, this.canvas);
    this.gizmo.addEventListener('dragging-changed', event => this.orbit.enabled = !event.value);
    this.scene.add(this.gizmo);

    this.camera.position.set(2, 2, 3);
    this.camera.lookAt(0, 0, 0);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(this.labelRenderer.domElement);

    this.orbit.addEventListener('change', this.render.bind(this));
    this.gizmo.addEventListener('change', this.render.bind(this));

    this.render();
    this.onWindowResize();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
