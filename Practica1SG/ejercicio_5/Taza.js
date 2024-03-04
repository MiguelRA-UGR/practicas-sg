// import THREE from 'three'

class Taza extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		//Se crean los objetos
		var cilindro_r = new THREE.CylinderGeometry(3, 3, 5.5, 32, 32, false);
		var cilindro_b = new THREE.CylinderGeometry(2.5, 2.5, 5.5, 32, 32, false);
		cilindro_b.translate(0, 0.5, 0);
		var torus = new THREE.TorusGeometry(1.5, 0.4, 32, 32);
		torus.translate(-3, 0, 0)

		//Se crean nodos BPS
		var cilindro_r_bps = new ThreeBSP(cilindro_r);
		var cilindro_b_bps = new ThreeBSP(cilindro_b);
		var torus_bps = new ThreeBSP(torus);

		//Se construye el arbol binario con las operaciones
		var taza_bps = cilindro_r_bps.union(torus_bps);
		var taza_final = taza_bps.subtract(cilindro_b_bps);
		this.taza = taza_final.toMesh(this.material_normal);

		this.taza.geometry.computeFaceNormals();
		this.taza.geometry.computeVertexNormals();
		this.add(this.taza);
	}

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
		this.taza.visible = this.guiControls.ver;
		this.taza.rotation.x += 0.025;
		this.taza.rotation.y += 0.010;

		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}