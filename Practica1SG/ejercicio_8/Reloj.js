class Reloj extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);
		
		// Se crean los materiales
		this.createMaterials();

		//Crear las esferas
		this.vector_esferas = this.crearEsferas();
		this.esferas_reloj = new THREE.Object3D();
		this.vector_esferas.forEach(elemento => this.esferas_reloj.add(elemento));
		this.add(this.esferas_reloj);

		//Crear minutero
		this.minutero = this.crearMinutero();
		this.add(this.minutero);

	};

	crearEsferas(){
		var x = -27; var z = 0;

		var vector_esferas = new Array();

		var geometry = new THREE.SphereBufferGeometry( 3, 32, 32 );
		var sphere = new THREE.Mesh( geometry, this.material_rojo);

		sphere.position.set(x, 0 ,z);
		vector_esferas.push(sphere);
		
		// Quiero rotar en el eje Y
		this.alfa = (2 * Math.PI) / 12;
		for(var i = 0; i < 12; i += this.alfa){
			var sphere_nueva = sphere.clone();
			var x_prima = x * Math.cos(i) + z * Math.sin(i);
			var z_prima = -x * Math.sin(i) + z * Math.cos(i);
			sphere_nueva.position.set(x_prima, 0, z_prima);
			vector_esferas.push(sphere_nueva);
		};

		return vector_esferas;
	};

	crearMinutero(){
		this.x = -20; this.z = 0;

		var geometry = new THREE.SphereBufferGeometry( 3, 32, 32 );
		var sphere = new THREE.Mesh( geometry, this.material_azul);

		sphere.position.set(this.x, 0 ,this.z);

		return sphere;
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
			// flatShading: true, //Sombreado plano
		});

		this.material_azul = new THREE.MeshPhongMaterial({
			color: 0x0b2fd4,
			side: THREE.DoubleSide,
			// flatShading: true, //Sombreado plano
		});

		this.material_naranja = new THREE.MeshPhongMaterial({
			color: 0xe18406,
			side: THREE.DoubleSide,
			flatShading: true, //Sombreado plano
		});

		this.material_verde = new THREE.MeshPhongMaterial({
			color: 0x53d40b,
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
		this.guiControls = new function () {
			this.velocidad = 0;

			this.reset = function () {
				this.velocidad = 0;
			}
		}

		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'velocidad', -12, 12, 0.1).name('Velotcidad (marcas/s): ').listen();
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		//Crear la animacion
		var fast = (this.alfa * this.guiControls.velocidad) / 60; //Entre 60 fotogramas por segundo

		var x = this.x * Math.cos(fast) + this.z * Math.sin(fast);
		var z = -this.x * Math.sin(fast) + this.z * Math.cos(fast);

		this.x = x;
		this.z = z;
		this.minutero.position.set(x, 0, -z);

		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}