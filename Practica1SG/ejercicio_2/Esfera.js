class Esfera extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Un Mesh se compone de geometría y material
    var geometria = new THREE.SphereBufferGeometry(this.guiControls.radio, this.guiControls.meridiano, this.guiControls.ecuador);

    // Como material se crea uno a partir de un color
    // var texture = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    // var texture2 = new THREE.TextureLoader().load('../imgs/wood.jpg');

    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;

    // var boxMat = new THREE.MeshPhongMaterial({ color: 0xBC2C2D });
    // var boxMat2 = new THREE.MeshPhongMaterial({ map: texture2 });

    // Ya podemos construir el render
    this.sphere = new THREE.Mesh(geometria, material);
    this.sphere.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

    // Y añadirlo como hijo del Object3D (el this)
    this.add(this.sphere);
    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura  
  }

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.radio = 4;
      this.meridiano = 8;
      this.ecuador = 6;

      this.posX = 0.0;
      this.posY = 40.0;
      this.posZ = 40.0;

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.radio = 4;
        this.meridiano = 8;
        this.ecuador = 6;
      }
    }

    var that = this;
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'radio', 1, 20, 0.1).name('Radio: ').onChange(function () {
      that.sphere.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.meridiano, that.guiControls.ecuador);
    });
    folder.add(this.guiControls, 'meridiano', 1, 32, 0.1).name('Res. Meridiano: ').onChange(function () {
      that.sphere.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.meridiano, that.guiControls.ecuador);
    });
    folder.add(this.guiControls, 'ecuador', 1, 32, 0.1).name('Res. Ecuador: ').onChange(function () {
      that.sphere.geometry = new THREE.SphereBufferGeometry(that.guiControls.radio, that.guiControls.meridiano, that.guiControls.ecuador);
    });

    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  }

  update() {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    this.sphere.rotateX(0.05); 
  }
}