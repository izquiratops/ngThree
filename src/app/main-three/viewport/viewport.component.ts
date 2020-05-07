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

    const initCube = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'First Cube');
    initCube.translateX(-0.75);
    this.scene.add(initCube);

    // Testing second cube. TODO: Get rid of this
    setTimeout(() => {
      const initCube2 = this.coreService.createInstance(new THREE.BoxBufferGeometry(), 'Second Cube');
      initCube2.translateX(0.75);
      this.scene.add(initCube2);
    }, 5000);

    console.debug('Objects Array', this.coreService.objects);
  }

  onMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  selectingVertex(): void {
    console.debug('Vertex selection case');
  }

  selectingEdge(): void {
    console.debug('Edge selection case');
  }

  selectingFace(): void {
    // Triangle obj which show the selected Face
    const triangle = this.coreService.helperObjects.triangle;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const objects = this.coreService.objects.map(element => element.mesh);
    const intersections = this.raycaster.intersectObjects(objects);
    console.debug('Intersections', intersections);

    if (intersections.length > 0) {
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
  }

  selectingMesh(): void {
    console.debug('Object selection case');
  }

  onMouseDown(event) {
    if (event.button === 0) {
      switch (this.coreService.options.selectionType) {
        case 'vertex':
          this.selectingVertex();
          break;
        case 'edge':
          this.selectingEdge();
          break;
        case 'face':
          this.selectingFace();
          break;
        case 'object':
          this.selectingMesh();
          break;
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

    // TODO: Do Sprites!
    // https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
    // const spritey = makeTextSprite( 'Henlo :)',
    //   { fontsize: 24, borderColor: {r: 255, g: 0, b: 0, a: 1.0}, backgroundColor: {r: 255, g: 100, b: 100, a: 0.8}} );
    // spritey.position.set(-85, 105, 55);
    // this.scene.add( spritey );

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
      this.renderer.setSize(width, height, false);
    }

    this.controls.update();
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
