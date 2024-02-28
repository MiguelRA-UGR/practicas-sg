
import * as THREE from 'three'

class Kart extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    this.createGUI(gui,titleGui);
    
    this.material = new THREE.MeshStandardMaterial({color: 0x9999FF});
    //this.material = new THREE.MeshNormalMaterial({color: 0x9999FF});

    var tamano = 1;
    var base = this.createBase(tamano);
    // Al nodo que contiene la transformación interactiva que abre y cierra la grapadora se accede desde el método update, se almacena en un atributo.
    this.movil = this.createMovil(tamano);
    
    // Al nodo  this, la grapadora, se le cuelgan como hijos la base y la parte móvil
    this.add (base);
    this.add (this.movil);
  }
  
  createBase(tama) {
    // El nodo del que van a colgar la caja y los 2 conos y que se va a devolver
    var base = new THREE.Object3D();
    // Cada figura, un Mesh, está compuesto de una geometría y un material
    var cajaBase = new THREE.Mesh (new THREE.BoxGeometry (tama,tama*0.08,tama*0.2), this.material);
    cajaBase.position.y = tama*0.04;
    // La componente geometría se puede compartir entre varios meshes
    var geometriaPivote = new THREE.ConeGeometry (tama*0.05, tama*0.12);
    var pivote1 = new THREE.Mesh (geometriaPivote, this.material);
    var pivote2 = new THREE.Mesh (geometriaPivote, this.material);
    // Se posicionan los pivotes con respecto a la base
    pivote1.position.set (tama*0.45, tama*0.14, tama*0.05);
    pivote2.position.set (tama*0.45, tama*0.14, -tama*0.05);
    base.add(cajaBase);
    base.add(pivote1);
    base.add(pivote2);
    return base;
  }
  
  createGUI (gui,titleGui) {
    // Controles para el movimiento de la parte móvil
    this.guiControls = {
      rotacion : 0
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add (this.guiControls, 'rotacion', -0.125, 0.2, 0.001)
      .name ('Apertura : ')
      .onChange ( (value) => this.setAngulo (-value) );
  }
  
  createMovil (tama) {
    // Se crea la parte móvil
    var cajaMovil = new THREE.Mesh (
        new THREE.BoxGeometry (tama, tama*0.12, tama*0.2),
        this.material
    );
    cajaMovil.position.set (-tama*0.45, tama*0.06, 0);
    
    var movil = new THREE.Object3D();
    // IMPORTANTE: Con independencia del orden en el que se escriban las 2 líneas siguientes, SIEMPRE se aplica primero la rotación y después 
    // la traslación. Prueba a intercambiar las dos líneas siguientes y verás que no se produce ningún cambio al ejecutar.    
    movil.rotation.z = this.guiControls.rotacion;
    movil.position.set(tama*0.45,tama*0.2,0);
    movil.add(cajaMovil);
    return movil;
  }
  
  setAngulo (valor) {
    this.movil.rotation.z = valor;
  }
  
  update () {

  }
}

export { Kart }
