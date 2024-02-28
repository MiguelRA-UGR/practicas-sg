import * as THREE from '../libs/three.module.js';

class Revolucion extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la revolución
    this.createGUI(gui, titleGui);

    // Crear el perfil 2D de la forma que se va a revolucionar
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

    // Crear la geometría de revolución a partir de la Shape
    this.resolution = 3; // Resolución inicial
    this.geometry = new THREE.LatheGeometry(shape.getPoints(), this.resolution);

    this.axis = new THREE.AxesHelper(2);
    this.add(this.axis);

    // Crear el material
    this.material = new THREE.MeshNormalMaterial();
    this.material.flatShading = true;
    this.material.needsUpdate = true;

    // Crear el mesh utilizando la geometría y el material
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);
  }

  createGUI(gui, titleGui) {
    // Controles para la resolución de la revolución
    this.guiControls = {
      resolution: 3, // Resolución inicial
      flatShading: true, // Indica si la iluminación es plana o suave
      // Función para resetear los controles
      reset: () => {
        this.guiControls.resolution = 3;
        this.guiControls.flatShading = true;
        this.updateMaterial();
      }
    };

    // Sección para los controles de la revolución
    var folder = gui.addFolder(titleGui);

    // Añadir control para la resolución
    folder.add(this.guiControls, 'resolution', 3, 50, 1).name('Resolución: ').listen();

    // Añadir control para la iluminación
    folder.add(this.guiControls, 'flatShading').name('Iluminación Plana').onChange(() => {
      this.updateMaterial();
    });

    // Añadir botón de reset
    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  update() {
    this.position.set(1, 0, 0);
    this.updateGeometry();
  }

  updateGeometry() {
    // Actualizar la geometría del mesh
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

    var shape = new THREE.Shape(points);
    this.geometry.dispose(); // Limpiamos la geometría anterior
    this.geometry = new THREE.LatheGeometry(shape.getPoints(), this.guiControls.resolution);
    // Actualizamos la geometría del Mesh
    this.mesh.geometry = this.geometry;
  }

  updateMaterial() {
    // Actualizar la iluminación del material
    this.material.flatShading = this.guiControls.flatShading;
    this.material.needsUpdate = true;
  }
}

export { Revolucion };
