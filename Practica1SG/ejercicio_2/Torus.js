class Torus extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Un Mesh se compone de geometría y material
    var geometria = new THREE.TorusBufferGeometry(this.guiControls.radio_principal, this.guiControls.radio_tubo, this.guiControls.resolucion_toro, this.guiControls.resolucion_tubo);

    // Como material se crea uno a partir de un color
    // var texture = new THREE.TextureLoader().load('../imgs/ladrillo-difuso.png');
    // var texture2 = new THREE.TextureLoader().load('../imgs/wood.jpg');

    var material = new THREE.MeshNormalMaterial();
    material.flatShading = true;
    material.needsUpdate = true;
    // var boxMat = new THREE.MeshPhongMaterial({ color: 0xBC2C2D });
    // var boxMat2 = new THREE.MeshPhongMaterial({ map: texture2 });

    // Ya podemos construir el render
    this.torus = new THREE.Mesh(geometria, material);
    this.torus.position.set(this.guiControls.posX, this.guiControls.posY, this.guiControls.posZ);

    // Y añadirlo como hijo del Object3D (el this)
    this.add(this.torus);
    // Las geometrías se crean centradas en el origen.
    // Como queremos que el sistema de referencia esté en la base,
    // subimos el Mesh de la caja la mitad de su altura

  }

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.radio_principal = 4;
      this.radio_tubo = 2;
      this.resolucion_toro = 10;
      this.resolucion_tubo = 10;

      this.posX = 0.0;
      this.posY = -40.0;
      this.posZ = 40.0;

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.radio_principal = 4;
        this.radio_tubo = 2;
        this.resolucion_toro = 10;
        this.resolucion_tubo = 10;
      }
    }

    var that = this;
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'radio_principal', 1, 32, 0.1).name('Radio principal: ').onChange(function () {
      that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radio_principal, that.guiControls.radio_tubo, that.guiControls.resolucion_toro, that.guiControls.resolucion_tubo);
    });
    folder.add(this.guiControls, 'radio_tubo', 1, 32, 0.1).name('Radio tubo: ').onChange(function () {
      that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radio_principal, that.guiControls.radio_tubo, that.guiControls.resolucion_toro, that.guiControls.resolucion_tubo);
    });
    folder.add(this.guiControls, 'resolucion_toro', 2, 32, 0.1).name('Resolución toro: ').onChange(function () {
      that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radio_principal, that.guiControls.radio_tubo, that.guiControls.resolucion_toro, that.guiControls.resolucion_tubo);
    });
    folder.add(this.guiControls, 'resolucion_tubo', 3, 32, 0.1).name('Resolución tubo: ').onChange(function () {
      that.torus.geometry = new THREE.TorusBufferGeometry(that.guiControls.radio_principal, that.guiControls.radio_tubo, that.guiControls.resolucion_toro, that.guiControls.resolucion_tubo);
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
    this.torus.rotateX(0.05);
  }
}