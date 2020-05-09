import { Injectable } from '@angular/core';
import { CoreService } from './core.service';

@Injectable()
export class SelectionService {
    constructor(
        private coreService: CoreService,
    ) {}

    selectingVertex(intersections): void {
        console.debug('Vertex selection case', intersections);
    }
    
    selectingEdge(intersections): void {
        console.debug('Edge selection case', intersections);
    }
    
    selectingFace(intersections): void {
        // Triangle obj which show the selected Face
        const triangle = this.coreService.helperObjects.find(element => element.name === 'triangleHelper');
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
        const object = intersections[0].object;
        const found = object.children.map(element => element.name === 'objectLabel');
    
        if (found.includes(true)) {
            console.warn('Object already labeled');
        } else {
            object.add(this.coreService.createLabel(object.name));
        }
    }
};