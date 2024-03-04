// import THREE from 'three'

class Tuerca extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();
		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
        this.createMaterials();

        //Se crean las geometrias
        // var espiral = this.creaEspiral();
        var geometria_cilindro = new THREE.CylinderGeometry(4, 4, 3, 6);
        // this.cilindro = new THREE.Mesh(geometria_cilindro, this.material_normal);

        var geometria_esfera = new THREE.SphereGeometry(4.1, 40, 40);
        // this.esfera = new THREE.Mesh(geometria_esfera, this.material_normal);
		
		//Para hacer espiral
		var geometria_cilindro_agujero = new THREE.CylinderGeometry(2, 2, 3, 32);
		// this.agujero = new THREE.Mesh(geometria_cilindro_agujero, this.material_rojo);

		//Para hacer la espiral
		var geometria_toro = new THREE.TorusGeometry(2, 0.1, 10, 32);
		geometria_toro.rotateX(Math.PI/2);
		var geometria_toro_copia = geometria_toro.clone();
		for(var i = 0; i < 29; ++i){
			var aux = geometria_toro_copia.clone();
			aux.translate(0, i*0.1, 0);
			geometria_toro.merge(aux);
		}
		geometria_toro.translate(0, -1.4, 0);
		// this.torus = new THREE.Mesh(geometria_toro, this.material_azul);

		//Se crean nodos BPS
		var cilindro_bps = new ThreeBSP(geometria_cilindro);
		var esfera_bps = new ThreeBSP(geometria_esfera);

		var agujero_bps = new ThreeBSP(geometria_cilindro_agujero);
		var espiral_bps = new ThreeBSP(geometria_toro);

		// //Se construye el arbol binario con las operaciones
		var contorno_bps = cilindro_bps.intersect(esfera_bps);
		var espiral_bps = agujero_bps.union(espiral_bps);
		var tuerca_bps = contorno_bps.subtract(espiral_bps);

		this.tuerca_fin = tuerca_bps.toMesh(this.material_normal);

		this.tuerca_fin.geometry.computeFaceNormals();
		this.tuerca_fin.geometry.computeVertexNormals();
		
		this.add(this.tuerca_fin);
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
		// this.alfa += 0.05;
		this.tuerca_fin.visible = this.guiControls.ver;
		this.tuerca_fin.rotation.x += 0.025;
		this.tuerca_fin.rotation.y += 0.010;
		
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}