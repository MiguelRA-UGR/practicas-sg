import * as THREE from '../libs/three.module.js';

class Forma2D extends THREE.Object3D {
    constructor(points) {
        super();

        // Verificar si se proporcionaron puntos, de lo contrario, utilizar puntos predeterminados
        if (!points || points.length === 0) {
            points = [
                new THREE.Vector2(1, 0),
                new THREE.Vector2(0, 1.75),
                new THREE.Vector2(-1, 0),

            ];
        }

        // Crear una Shape a partir de los puntos
        var shape = new THREE.Shape(points);

        // Crear la geometría de la forma a partir de la Shape
        var geometry = new THREE.ShapeGeometry(shape);

        // Crear una geometría para el contorno de la forma
        var edges = new THREE.EdgesGeometry(geometry);

        // Crear el material para el contorno
        var material = new THREE.LineBasicMaterial({ color: 0x0000FF });

        // Crear la línea utilizando la geometría del contorno y el material
        var line = new THREE.LineSegments(edges, material);

        // Añadir la línea como hijo de este Object3D
        this.add(line);
    }

    update() {
        // Actualizar la posición y el escalado según los controles
        this.position.set(-1, 1, 0);
    }

    getPoints() {
      return this.points;
  }
}

export { Forma2D };

