import * as THREE from '../libs/three.module.js';

class Cono extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde al cono
    this.createGUI(gui, titleGui);

    // Un Mesh se compone de geometría y material
    // Creamos la geometría del cono con los valores iniciales
    this.geometry = new THREE.ConeGeometry(0.25, 0.5, 3, 1); // Radio, altura, resolución
    

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
    // Controles para el tamaño y la resolución del cono
    this.guiControls = {
      radius: 0.25,
      height: 0.5,
      resolution: 3,
      
      // Función para actualizar la geometría del cono
      updateGeometry: function() {
        this.geometry.dispose(); // Limpiamos la geometría anterior
        this.geometry = new THREE.ConeGeometry(this.guiControls.radius, this.guiControls.height, this.guiControls.resolution, 1);
        // Actualizamos la geometría del Mesh
        this.mesh.geometry = this.geometry;
      }.bind(this) // Importante para que this haga referencia a la instancia de la clase Cono
    };

    // Se crea una sección para los controles del cono
    var folder = gui.addFolder(titleGui);

    // Añadimos controles para el radio, la altura y la resolución
    folder.add(this.guiControls, 'radius', 0.1, 5.0, 0.01).name('Radio').onChange(this.guiControls.updateGeometry);
    folder.add(this.guiControls, 'height', 0.1, 5.0, 0.01).name('Altura').onChange(this.guiControls.updateGeometry);
    folder.add(this.guiControls, 'resolution', 3, 20, 1).name('Resolución').onChange(this.guiControls.updateGeometry);
  }

  update () {
    // Actualizamos la rotación del cono
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
    this.rotation.z += 0.01;

    // Actualizamos la posición del cono
    this.position.set(0, 0.5, 0);

    // Actualizamos el radio y la altura del cono
    this.guiControls.updateGeometry();
}

}

export { Cono };
