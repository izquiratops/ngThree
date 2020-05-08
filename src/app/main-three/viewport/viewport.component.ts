import {Component, ElementRef, ViewChild, HostListener, OnInit, AfterViewInit} from '@angular/core';
import {CoreService} from '../core.service';
import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import {Vector4} from 'three';

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
  labelRenderer: CSS2DRenderer;

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
    this.scene.add(this.coreService.createTriangle());
    this.scene.add(this.coreService.createGrid());
    this.scene.add(this.coreService.createAxes());

    const initTrans = new THREE.Matrix4().makeTranslation(0.75, 0, 0);
    const initCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'Init Cube', initTrans);
    this.scene.add(initCube);

    // Testing async cube.
    setTimeout(() => {
      const asyncTrans = new THREE.Matrix4().makeTranslation(-0.75, 0, 0);
      const asyncCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'Async Cube', asyncTrans);
      this.scene.add(asyncCube);
    }, 5000);

    console.debug('Objects Array', this.coreService.objects);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  selectingVertex(intersections): void {
    console.debug('Vertex selection case', intersections);
  }

  selectingEdge(intersections): void {
    console.debug('Edge selection case', intersections);
  }

  selectingFace(intersections): void {
    // Triangle obj which show the selected Face
    const triangle = this.coreService.helperObjects.triangle;
    const object = intersections[0].object;
    const face = intersections[0].face;

    const trianglePosition = (triangle.geometry as any).attributes.position;
    const objectPosition = (object as any).geometry.attributes.position;

    /**
     * https://threejs.org/docs/#api/en/core/BufferAttribute
     * 'copyAt' copy a vector from a bufferAttribute[index2] to a Array[index1].
     * 'applyMatrix4' applies matrix to every Vector3 element.
     */
    trianglePosition.copyAt(0, objectPosition, face.a);
    trianglePosition.copyAt(1, objectPosition, face.b);
    trianglePosition.copyAt(2, objectPosition, face.c);
    trianglePosition.copyAt(3, objectPosition, face.a);
    triangle.geometry.applyMatrix4(object.matrix);

    triangle.visible = true;
  }

  selectingMesh(intersections): void {
    // const object: THREE.Mesh = intersections[0].object;
    // const objectPosition = object.position;
    console.debug('Object selection case', intersections);
  }

  onMouseDown(event) {
    if (event.button === 0) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersections = this.raycaster.intersectObjects(this.coreService.objects);
      if (intersections.length > 0) {
        switch (this.coreService.options.selectionType) {
          case 'vertex':
            this.selectingVertex(intersections);
            break;
          case 'edge':
            this.selectingEdge(intersections);
            break;
          case 'face':
            this.selectingFace(intersections);
            break;
          case 'mesh':
            this.selectingMesh(intersections);
            break;
        }
      }
    }
  }

  @HostListener('document:keydown.a', [])
  onKeydownHandler() {
    // TODO: There's no such a thing like 'selection' implemented yet, just a sad sad triangle
    const triangle = this.coreService.helperObjects.triangle;
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

  // TODO: Transforms like Translation
  // https://threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html
  // this.cube.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

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
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
