import { Component, OnInit } from '@angular/core';
import {CoreService} from "../core.service";
import * as THREE from "three";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  checked = false;

  constructor(
    private coreService: CoreService,
  ) { }

  ngOnInit(): void {
  }

  toggleWireframe() {
    this.coreService.objects.forEach((element) => {
      (element.material as THREE.MeshNormalMaterial).wireframe = this.checked;
    });
  }
}
