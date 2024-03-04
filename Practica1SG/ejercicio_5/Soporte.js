// import THREE from 'three'

class Soporte extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		//Se crean los objetos
        //Se crea el Shape
        this.angulo_shape = this.crearAngulo(); //Shape
        this.options = {
            steps: 16,
            depth: 0.1,
            bevelThickness: 1,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 1,
        }

        //Geometria del angulo
        var geometry_shape = new THREE.ExtrudeGeometry(this.angulo_shape, this.options);
        geometry_shape.scale(1, 1, 1.5);

        //Agujeros que van a ser cilindros
        var geometry_cilindro = new THREE.CylinderGeometry( 0.5, 1, 1, 32 );
        var geometry_cilindro_copia = geometry_cilindro.clone();

        geometry_cilindro_copia.rotateZ(Math.PI*0.5);
        geometry_cilindro_copia.translate(0.5, 2, 0);

        geometry_cilindro.translate(8, 9.5, 0);
        geometry_cilindro.merge(geometry_cilindro_copia);

        // Se crean nodos BPS
		var angulo_bps = new ThreeBSP(geometry_shape);
		var agujeros_bps = new ThreeBSP(geometry_cilindro);

		//Se construye el arbol binario con las operaciones
		var soporte_bps = angulo_bps.subtract(agujeros_bps);
		this.soporte = soporte_bps.toMesh(this.material_normal);

		this.soporte.geometry.computeFaceNormals();
        this.soporte.geometry.computeVertexNormals();
        
		this.add(this.soporte);
    }
    
    crearAngulo(){
        // Creo el Shape
        var shape = new THREE.Shape();

        //Se crea el contorno extrior
        shape.moveTo(0, 0);
        shape.lineTo(0, 10);
        shape.lineTo(10, 10);
        shape.lineTo(10, 9);
        shape.lineTo(4, 9);
        shape.quadraticCurveTo(1, 9, 1, 6); //Los dos primeros es el del control, los otros dos ultimos donde se llegue
        shape.lineTo(1, 0);
        shape.lineTo(0, 0);

        return shape;
    };

	createMaterials() {
		// Material de los puntos
		this.points_material = new THREE.PointsMaterial({
			color: 0xda1719,
			size: 0.2,
		});

		this.material_rojo = new THREE.MeshPhongMaterial({
			color: 0xda1719,
			side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
		});

		this.material_azul = new THREE.MeshPhongMaterial({
			color: 0x0b2fd4,
			side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
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
			this.ver = true;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		this.soporte.visible = this.guiControls.ver;
		this.soporte.rotation.x += 0.025;
		this.soporte.rotation.y += 0.010;

		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}