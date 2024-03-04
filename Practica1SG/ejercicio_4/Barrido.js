// import THREE from 'three'


class Barrido extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Se crean los materiales
    this.createMaterials();

    //Se crea el Shape
    this.Shapeado = this.createShape(); //Shape

    // En pts se guarda un array de THREE.Vector 3 que define que camino

    // Puntos
    this.points = new Array();
    // Se añaden puntos al array
    this.points.push(new THREE.Vector3(-10, 0, 10));
    this.points.push(new THREE.Vector3(-5, 5, 5));
    this.points.push(new THREE.Vector3(0, 0, 0));
    this.points.push(new THREE.Vector3(10, 0, 10));

    var path = new THREE.CatmullRomCurve3(this.points);
    this.options = {
      steps: 2,
      depth: 0.1,
      bevelThickness: 1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1,
      extrudePath: path 
    }


    var geometry = new THREE.ExtrudeGeometry(this.Shapeado, this.options);
    this.object_shape = new THREE.Mesh(geometry, this.material_normal);
    this.add(this.object_shape);

    //Escalado
    this.object_shape.scale.set(0.5, 0.5, 0.5);
    this.object_shape.position.set(0, 30, 0);
  }

  createShape() {
    // Creo el Shape
    var shape = new THREE.Shape();

    //Se crea el contorno extrior
    shape.moveTo(10, 10);
    shape.lineTo(10, 40);
    shape.bezierCurveTo(15, 25, 25, 25, 30, 40); //Va cogiendo de puntos en 2D
    shape.splineThru([new THREE.Vector2(30, 30), new THREE.Vector2(30, 20), new THREE.Vector2(30, 10)]);
    shape.quadraticCurveTo(20, 15, 10, 10); //Los dos primeros es el del control, los otros dos ultimos donde se llegue

    //Agujeros de ojos y boca
    var hole = new THREE.Shape();
    hole.absellipse(16, 24, 2, 3, 0, Math.PI * 2); //x, y, radiox, radioy, angulo_inicial, an_final
    shape.holes.push(hole);
    hole = new THREE.Shape();
    hole.absellipse(24, 24, 2, 3, 0, Math.PI * 2);
    shape.holes.push(hole);

    // El otro ojo con otra elipse de manera similar, ahora la boca
    hole = new THREE.Shape();
    hole.absarc(20, 16, 2, Math.PI * 2, Math.PI); //x, y, radio angulo_inicial, an_final
    shape.holes.push(hole);

    return shape;
  };

  createMaterials() {
    // Material de los puntos
    this.points_material = new THREE.PointsMaterial({
      color: 0xda1719,
      size: 0.2,
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
      this.visible = true;


      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.steps = 2;
        this.depth = 0.1;
        this.bevelThickness = 1;
        this.bevelSize = 0;
        this.bevelOffset = 0;
        this.bevelSegments = 1;
        this.visible = true;
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

    folder.add(this.guiControls, 'visible').name('Mostrar objeto: ');


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
    this.object_shape.visible = this.guiControls.visible;

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