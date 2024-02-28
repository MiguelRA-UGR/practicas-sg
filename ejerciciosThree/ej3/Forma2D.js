import * as THREE from '../libs/three.module.js';

class Forma2D extends THREE.Object3D {
    constructor(gui, titleGui) {
    super();

    // Crear el perfil 2D de la forma
    var points = [];
    points.push(new THREE.Vector2(0.0, 0.0));
    points.push(new THREE.Vector2(0.1, 0.1));
    points.push(new THREE.Vector2(0.3, 0.2));
    points.push(new THREE.Vector2(0.4, 0.4));
    points.push(new THREE.Vector2(0.3, 0.5));
    points.push(new THREE.Vector2(0.35, 0.7));
    points.push(new THREE.Vector2(0.5, 0.8));
    points.push(new THREE.Vector2(0.5, 0.9));
    points.push(new THREE.Vector2(0.7, 1));
    points.push(new THREE.Vector2(0, 1.1));


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
    this.position.set(-1, 0, 0);
  }
}

export { Forma2D };
