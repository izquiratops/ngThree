import { Mesh } from 'three';

export interface ItemObjList {
    mesh: Mesh;
  /**
   * Type of objects:
   * - Mesh
   * - Camera
   * - Light
   */
  type: string;
}
