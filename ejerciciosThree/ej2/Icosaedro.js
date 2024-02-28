import * as THREE from '../libs/three.module.js';

class Icosaedro extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde al toroide
    this.createGUI(gui, titleGui);

    // Creamos la geometría del toroide con los valores iniciales
    this.geometry = new THREE.IcosahedronGeometry(0.5, 0); // Radio del tubo, radio del toro, segmentos radiales, segmentos tubulares

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
      detail: 0,
      
      // Función para actualizar la geometría del toroide
      updateGeometry: function() {
        this.geometry.dispose(); // Limpiamos la geometría anterior
        this.geometry = new THREE.IcosahedronGeometry(this.guiControls.radius, this.guiControls.detail);
        // Actualizamos la geometría del Mesh
        this.mesh.geometry = this.geometry;
      }.bind(this) // Importante para que this haga referencia a la instancia de la clase Toroide
    };

    // Se crea una sección para los controles del toroide
    var folder = gui.addFolder(titleGui);

    // Añadimos controles para el radio del tubo, radio del toro y resolución
    folder.add(this.guiControls, 'radius', 0.5, 1, 0.01).name('Radio').onChange(this.guiControls.updateGeometry);
    folder.add(this.guiControls, 'detail', 0, 3, 1).name('Detalle').onChange(this.guiControls.updateGeometry);
  }

  update () {
    // Actualizamos la rotación del toroide
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    this.rotation.z += 0.01;

    // Actualizamos la posición del toroide
    this.position.set(1.5, -1.5, -1.5);

    // Actualizamos la geometría del toroide
    this.guiControls.updateGeometry();
  }
}

export { Icosaedro };


