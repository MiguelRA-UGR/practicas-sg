class Bola extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();
		//Al principio la bola va a subir
		this.subir = true;

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		this.cilindro = this.crearCilindro();
		this.bola = this.crearBola();

		this.bola_rotando = new THREE.Object3D();
		this.bola_rotando.add(this.bola);

		this.add(this.cilindro);
		this.add(this.bola_rotando);
	};

	crearCilindro(){
		var geometria = new THREE.CylinderBufferGeometry( 1, 1, 30, 128 );
		var cilindro = new THREE.Mesh(geometria, this.material_normal_opacity);

		cilindro.geometry.translate(0, 15, 0);

		return cilindro;
	};

	crearBola(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		var bola = new THREE.Mesh( geometria, this.material_normal);

		return bola;
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

		this.material_normal = new THREE.MeshNormalMaterial({
			flatShading: true,
			needsUpdate: true
		});

		this.material_normal_opacity = new THREE.MeshNormalMaterial({
			flatShading: true,
			needsUpdate: true,
			opacity: 0.35,
			transparent:true
		});
	};

	createGUI(gui, titleGui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.radio = 10;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.radio = 10;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'radio', 5, 30, 0.1).name('Radio: ').listen();
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		this.cilindro.scale.set(this.guiControls.radio, 1, this.guiControls.radio);

		this.bola.position.set(0, 3, this.guiControls.radio);



		if(this.bola_rotando.position.y >= 30){
			this.subir = false;
		}else if(this.bola_rotando.position.y <= 0){
			this.subir = true;
		}

		if(this.subir){
			this.bola_rotando.position.y += 0.05;
			this.bola_rotando.rotateY(0.02);
		
		}else{
			this.bola_rotando.position.y -= 0.05;
			this.bola_rotando.rotateY(-0.02);
		}

		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}