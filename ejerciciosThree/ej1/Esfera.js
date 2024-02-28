import * as THREE from '../libs/three.module.js';

class Esfera extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde al toroide
    this.createGUI(gui, titleGui);

    // Creamos la geometría del toroide con los valores iniciales
    this.geometry = new THREE.SphereGeometry(0.5, 1, 1); // Radio del tubo, radio del toro, segmentos radiales, segmentos tubulares

    // Creamos el material
    var material = new THREE.MeshNormalMaterial({ color: 0xCF0000 });
    material.flatShading=true;
    material.needsUpdate=true;

    // Creamos el Mesh
    this.mesh = new THREE.Mesh(this.geometry, material);

    // Añadimos el Mesh como hijo del Object3D (el this)
    this.add(this.mesh);
  }

  createGUI(gui, titleGui) {
    // Controles para el radio del tubo, radio del toro y resolución
    this.guiControls = {
      radius: 0.5,
      widthSegments: 1,
      heightSegments: 1,
      
      // Función para actualizar la geometría del toroide
      updateGeometry: function() {
        this.geometry.dispose(); // Limpiamos la geometría anterior
        this.geometry = new THREE.SphereGeometry(this.guiControls.radius, this.guiControls.widthSegments, this.guiControls.heightSegments);
        // Actualizamos la geometría del Mesh
        this.mesh.geometry = this.geometry;
      }.bind(this) // Importante para que this haga referencia a la instancia de la clase Toroide
    };

    // Se crea una sección para los controles del toroide
    var folder = gui.addFolder(titleGui);

    // Añadimos controles para el radio del tubo, radio del toro y resolución
    folder.add(this.guiControls, 'radius', 0.25, 0.5, 0.01).name('Radio').onChange(this.guiControls.updateGeometry);
    folder.add(this.guiControls, 'widthSegments', 1, 30, 0.01).name('Ecuador').onChange(this.guiControls.updateGeometry);
    folder.add(this.guiControls, 'heightSegments', 1, 30, 1).name('Meridiano').onChange(this.guiControls.updateGeometry);
  }

  update () {
    // Actualizamos la rotación del toroide
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    this.rotation.z += 0.01;

    // Actualizamos la posición del toroide
    this.position.set(0, -1.5, 0);

    // Actualizamos la geometría del toroide
    this.guiControls.updateGeometry();
  }
}

export { Esfera };


