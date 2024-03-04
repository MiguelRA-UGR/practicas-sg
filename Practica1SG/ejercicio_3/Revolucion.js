// import { fuchsia } from "color-name";

class Revolucion extends THREE.Object3D {
  constructor(gui, titleGui) {
    super();

    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui, titleGui);

    // Se crean los materiales
    this.createMaterials();

    // Puntos
    this.points = new Array();
    // Se añaden puntos al array
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

    // Para crear la figura por revolución (Parametros: Puntos, Segmentos, PhiStart, PiLength)
    this.latheObject = new THREE.Mesh(new THREE.LatheGeometry(this.points, 10, 1.5, 0.1), this.material_normal);

    // Para crear una línea visible, como en el vídeo
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices = this.points;

    //Objectos a construir
    this.Point = new THREE.Points(lineGeometry, this.points_material);
    this.Line = new THREE.Line(lineGeometry, this.lines_material);

    this.add(this.Point);
    this.add(this.Line);

    //Elevo el objeto, (de esta forma) que es lo mismo que hacerselo a los puntos, linea, y objeto a la vez
    this.position.y = 1.4;
    this.add(this.latheObject);
  }

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

    this.material_normal = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
      flatShading: true,
      needsUpdate: true
    });
  };

  createGUI(gui, titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.segmentos = 10;
      this.angulo = 0.1;
      this.ver_puntos = true;
      this.ver_lineas = false;
      this.ver_objeto = false;

      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.segmentos = 10;
        this.angulo = 0.1;
        this.ver_puntos = true;
        this.ver_lineas = false;
        this.ver_objeto = false;
      }
    }

    //Referencio a la clase
    var that = this;

    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder(titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add(this.guiControls, 'segmentos', 1, 64, 1).name('Segmentos: ').onChange(function () {
      that.latheObject.geometry = new THREE.LatheGeometry(that.points, that.guiControls.segmentos, 1.5, that.guiControls.angulo);
    });
    folder.add(this.guiControls, 'angulo', 0.1, 2 * Math.PI, 0.1).name('Angulo: ').onChange(function () {
      that.latheObject.geometry = new THREE.LatheGeometry(that.points, that.guiControls.segmentos, 1.5, that.guiControls.angulo);
    });

    folder.add(this.guiControls, 'ver_puntos').name('Ver Puntos: ');
    folder.add(this.guiControls, 'ver_lineas').name('Ver Lineas: ');
    folder.add(this.guiControls, 'ver_objeto').name('Ver Objeto: ');

    folder.add(this.guiControls, 'reset').name('[ Reset ]');
  };

  update() {
    this.Point.visible = this.guiControls.ver_puntos;
    this.Line.visible = this.guiControls.ver_lineas;
    this.latheObject.visible = this.guiControls.ver_objeto;
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
  };
}