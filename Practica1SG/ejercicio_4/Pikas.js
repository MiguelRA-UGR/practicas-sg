// import THREE from 'three'


class Pikas extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Se crean los materiales
    this.createMaterials();

    this.points = new Array();
    this.points.push(new THREE.Vector3(0.0, 1.5, 0.0));
    this.points.push(new THREE.Vector3(0.3, 1.4, 0.0));
    this.points.push(new THREE.Vector3(0.5, 1.2, 0.0));
    this.points.push(new THREE.Vector3(0.55, 1.0, 0.0));
    this.points.push(new THREE.Vector3(0.5, 0.8, 0.0));
    this.points.push(new THREE.Vector3(0.5, 0.6, 0.0));
    this.points.push(new THREE.Vector3(0.4, 0.5, 0.0));
    this.points.push(new THREE.Vector3(0.4, -0.4, 0.0));
    this.points.push(new THREE.Vector3(0.5, -0.7, 0.0));
    this.points.push(new THREE.Vector3(1.0, -1.1, 0.0));
    this.points.push(new THREE.Vector3(1.0, -1.4, 0.0));
    this.points.push(new THREE.Vector3(0.0, -1.4, 0.0));

    this.latheObject = new THREE.Mesh(new THREE.LatheGeometry(this.points, 10, 1.5, 6.3), this.material_azul);
    this.add(this.latheObject);
    this.latheObject.geometry.scale(2, 2, 2);
    this.latheObject.position.z = -0.5;


    //Se crea el Shape
    this.Shapeado = this.createShape(); //Shape

    // En pts se guarda un array de THR
    this.options = {
      steps: 2,
      depth: 2,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelOffset: 0.5,
      bevelSegments: 20,
    }

    //Corazon
    var geometry = new THREE.ExtrudeGeometry(this.Shapeado, this.options);
    this.object_shape = new THREE.Mesh(geometry, this.material_azul);
    this.object_shape.geometry.rotateX(Math.PI);
    this.object_shape.position.y = 9;
    this.trebol = new THREE.Object3D;
    this.trebol.add(this.latheObject);
    this.trebol.add(this.object_shape);


    //   Para que se mueva respcto el origen
    this.Shapazo = new THREE.Object3D();
    this.Shapazo.position.x = -10;
    this.Shapazo.position.y = 10;

    this.Shapazo.add(this.trebol);

    this.nodo = new THREE.Object3D();
    this.nodo.add(this.Shapazo);

    this.add(this.nodo);
  }

  createShape() {
    // Creo el Shape
    var shape = new THREE.Shape();

    //Se crea el contorno extrior
    shape.moveTo(0, 0);
    shape.lineTo(5, 5);
    shape.quadraticCurveTo(5, 12, 0, 7); //Los dos primeros es el del control, los otros dos ultimos donde se llegue
    shape.quadraticCurveTo(-5, 12, -5, 5);

    return shape;
  };

  createMaterials() {
    // Material de los puntos
    this.points_material = new THREE.PointsMaterial({
      color: 0xda1719,
      size: 0.2,
    });

    this.material_azul = new THREE.MeshPhongMaterial({
      color: 0xeabe0b,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    // Material de las lineas
    this.lines_material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      // linecap: 'round', //ignored by WebGLRenderer
      // linejoin:  'round' //ignored by WebGLRenderer
    });

    // Material del objeto
    this.object_material = new THREE.MeshPhongMaterial({
      color: 0xda1719,
      side: THREE.DoubleSide,
      flatShading: true,
    });

    this.material_normal = new THREE.MeshNormalMaterial();
    this.material_normal.flatShading = true;
    this.material_normal.needsUpdate = true;
  };

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja

    this.guiControls = new function () {
      this.steps = 2;
      this.depth = 0.1;
      this.bevelThickness = 1;
      this.bevelSize = 0;
      this.bevelOffset = 0;
      this.bevelSegments = 1;

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.steps = 2;
        this.depth = 0.1;
        this.bevelThickness = 1;
        this.bevelSize = 0;
        this.bevelOffset = 0;
        this.bevelSegments = 1;
      }
    }

    //Referencio a la clase
    var that = this;

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'steps', 1, 60, 1).name('Steps: ').onChange(function () {
      that.options.steps = that.guiControls.steps;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });

    folder.add(this.guiControls, 'depth', 0.1, 20, 0.1).name('Depth: ').onChange(function () {
      that.options.depth = that.guiControls.depth;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });

    folder.add(this.guiControls, 'bevelThickness', 0, 10, 0.5).name('bevelThickness: ').onChange(function () {
      that.options.bevelThickness = that.guiControls.bevelThickness;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });

    folder.add(this.guiControls, 'bevelSize', 0, 10, 0.5).name('bevelSize: ').onChange(function () {
      that.options.bevelSize = that.guiControls.bevelSize;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });

    folder.add(this.guiControls, 'bevelOffset', 0, 10, 0.5).name('bevelOffset: ').onChange(function () {
      that.options.bevelOffset = that.guiControls.bevelOffset;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });

    folder.add(this.guiControls, 'bevelSegments', 0, 10, 0.5).name('bevelSegments: ').onChange(function () {
      that.options.bevelSegments = that.guiControls.bevelSegments;
      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });


    folder.add(this.guiControls, 'reset').name('[ Reset ]').onChange(function () {
      that.options.steps = that.guiControls.steps;
      that.options.depth = that.guiControls.depth;
      that.options.bevelThickness = that.guiControls.bevelThickness;
      that.options.bevelSize = that.guiControls.bevelSize;
      that.options.bevelOffset = that.guiControls.bevelOffset;
      that.options.bevelSegments = that.guiControls.bevelSegments;

      that.object_shape.geometry = new THREE.ExtrudeGeometry(that.Shapeado, that.options);
    });
  };

  update() {
    this.nodo.rotateZ(+0.01);
    this.Shapazo.rotateZ(-0.01);
    this.trebol.rotateY(0.05);

    // this.alfa += 0.05;
    // this.object_shape.geometry.rotateY(0.05);
    // this.object_shape.geometry.translate(1,1,0);




    // this.position.x = this.position.x * Math.cos(alfa) - this.position.y * Math.sin(alfa);
    // this.position.y = this.position.x * Math.sin(alfa) + this.position.y * Math.cos(alfa);
    // this.object_shape.position.x = this.object_shape.position.x * Math.cos(this.alfa) - this.object_shape.position.y * Math.sin(this.alfa);
    // this.object_shape.position.y = this.object_shape.position.x *  Math.sin(this.alfa) + this.object_shape.position.y * Math.cos(this.alfa);
    // this.position.z = this.positi
    // this.Point.visible = this.guiControls.ver_puntos;
    // this.Line.visible = this.guiControls.ver_lineas;
    // this.latheObject.visible = this.guiControls.ver_objeto;
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
  };
}