import { Injectable } from '@angular/core';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { CoreService } from './core.service';

@Injectable()
export class SelectionService {
    constructor(
        private coreService: CoreService,
    ) { }

    selectingFace(intersections): void {
        // Triangle obj which show the selected Face
        const triangle: any = this.coreService.helperObjects
            .find(element => element.name === 'triangleHelper');
        const object: any = intersections[0].object;
        const face = intersections[0].face;

        const trianglePosition = triangle.geometry.attributes.position;
        const objectPosition = object.geometry.attributes.position;

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

    selectingMesh(intersections, gizmo: TransformControls): void {
        const object = intersections[0].object;
        const found = object.children.find(element => element.name === 'objectLabel');

        if (found) {
            console.debug('Object already selected');
        } else {
            gizmo.attach(object);
            object.add(this.coreService.createLabel(object.name));
        }
    }
};