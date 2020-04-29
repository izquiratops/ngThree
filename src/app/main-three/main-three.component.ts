import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

// Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

@Component({
  selector: 'app-main-three',
  templateUrl: './main-three.component.html',
  styleUrls: ['./main-three.component.scss']
})
export class MainThreeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas', { static: false }) canvasElement: ElementRef;
  canvas: HTMLCanvasElement;

  options = {
    Wireframe: true,
  };

  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  renderer: THREE.WebGLRenderer = null;

  mouse: THREE.Vector2 = new THREE.Vector2(1, 1);
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  controls: OrbitControls = null;
  stats: Stats = Stats();
  // gui: GUI = new GUI();

  // Angular Sidebar
  checked = false;

  cube: THREE.Mesh;
  line: THREE.Line;

  constructor() {
  }

  ngOnInit(): void {
    document.body.appendChild(this.stats.dom);

    // TODO: Wireframe Option
    // this.gui.add(this.options, 'Wireframe').onChange(() => {
    //   this.objects.forEach(element => element.children[0].visible = this.options.Wireframe);
    // });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
    this.mouse.y = - (event.clientY / this.canvas.clientHeight) * 2 + 1;
  }

  @HostListener('document:mousedown', [])
  onMouseDown() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersection = this.raycaster.intersectObject(this.cube);

    if (intersection.length > 0) {
      const face = intersection[ 0 ].face;
      // @ts-ignore
      const linePosition = this.line.geometry.attributes.position;
      // @ts-ignore
      const cubePosition = this.cube.geometry.attributes.position;

      /**
       * https://threejs.org/docs/#api/en/core/BufferAttribute
       * 'copyAt' copy a vector from a bufferAttribute[index2] to a Array[index1].
       * 'applyMatrix4' applies matrix to every Vector3 element.
       */
      linePosition.copyAt( 0, cubePosition, face.a );
      linePosition.copyAt( 1, cubePosition, face.b );
      linePosition.copyAt( 2, cubePosition, face.c );
      linePosition.copyAt( 3, cubePosition, face.a );
      this.line.geometry.applyMatrix4( this.cube.matrix );

      // https://threejsfundamentals.org/threejs/lessons/threejs-optimize-lots-of-objects.html
      // this.cube.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 0.5));

      this.line.visible = true;
    }
  }

  private createInstance(geometry): void {
    // Color Material Mesh
    const material = new THREE.MeshNormalMaterial({
      wireframe: false,
      wireframeLinewidth: 3,
      // color: 0x555555,
      // specular: 0xffffff,
      // shininess: 50,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private render(): void {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if ( this.canvas.width !== width || this.canvas.height !== height ) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
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
    this.renderer = new THREE.WebGLRenderer({
      canvas: (this.canvasElement.nativeElement as HTMLCanvasElement),
      antialias: true,
      alpha: true
    });
    this.canvas = this.renderer.domElement;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.camera.position.set(2, 2, 3);
    this.camera.lookAt(0, 0, 0);

    /**
     * Setup Geometry and Lighting
     */

    // Selection Triangle!!!
    const triangleGeo = new THREE.BufferGeometry();
    triangleGeo.setAttribute('position', new THREE.BufferAttribute( new Float32Array( 4 * 3 ), 3 ));
    const triangleMat = new THREE.LineBasicMaterial({ color: 0x00FF00, transparent: true, linewidth: 3 });
    this.line = new THREE.Line( triangleGeo, triangleMat );
    this.scene.add(this.line);

    // Grid Helper
    const gridHelper = new THREE.GridHelper( 10, 20 );
    this.scene.add( gridHelper );

    this.createInstance(new THREE.BoxBufferGeometry());

    requestAnimationFrame(this.render.bind(this));
  }

  toggleWireframe() {
    (this.cube.material as THREE.MeshNormalMaterial).wireframe = this.checked;
  }
}
