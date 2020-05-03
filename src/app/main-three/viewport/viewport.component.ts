import {Component, ElementRef, ViewChild, HostListener, OnInit, AfterViewInit} from '@angular/core';
import {CoreService} from '../core.service';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

@Component({
  selector: 'app-viewport',
  templateUrl: './viewport.component.html',
  styleUrls: ['./viewport.component.scss']
})
export class ViewportComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', {static: false}) canvasElement: ElementRef;
  canvas: HTMLCanvasElement;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  controls: OrbitControls;
  stats: Stats;

  constructor(
    private coreService: CoreService,
  ) {
  }

  ngOnInit(): void {
    // Core elements
    this.scene = new THREE.Scene();

    // Interaction objs
    this.mouse = new THREE.Vector2(1, 1);
    this.raycaster = new THREE.Raycaster();

    // Debug stats
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    // Setup Initial Objects
    const triangle = this.coreService.createTriangle();
    this.scene.add(triangle);
    const grid = this.coreService.createGrid();
    this.scene.add(grid);
    const initCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'InitCube');
    this.scene.add(initCube);

    console.debug('Objects Array', this.coreService.objects);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  @HostListener('document:mousedown', [])
  onMouseDown() {
    // TODO: right now objects[0] is always the 'InitCube'
    const cube = this.coreService.objects[0].mesh;

    const triangle = this.coreService.helperObjects.triangle;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersection = this.raycaster.intersectObject(cube);

    // TODO: Check 'mousedown' only when left-click
    if (intersection.length > 0) {
      const face = intersection[0].face;
      const linePosition = (triangle.geometry as any).attributes.position;
      const cubePosition = (cube.geometry as any).attributes.position;

      /**
       * https://threejs.org/docs/#api/en/core/BufferAttribute
       * 'copyAt' copy a vector from a bufferAttribute[index2] to a Array[index1].
       * 'applyMatrix4' applies matrix to every Vector3 element.
       */
      linePosition.copyAt(0, cubePosition, face.a);
      linePosition.copyAt(1, cubePosition, face.b);
      linePosition.copyAt(2, cubePosition, face.c);
      linePosition.copyAt(3, cubePosition, face.a);
      triangle.geometry.applyMatrix4(cube.matrix);

      // https://threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html
      // this.cube.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));
      triangle.visible = true;
    }
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

    requestAnimationFrame(this.render.bind(this));
  }

  private render(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }

    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
