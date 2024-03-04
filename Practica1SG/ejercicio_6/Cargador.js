class Cargador extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		var that = this;
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath("../models/ironMan/");
		mtlLoader.load("IronMan.mtl", function(materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath("../models/ironMan/");
			objLoader.load("IronMan.obj", function(modelo3D) {
				that.add(modelo3D);
				console.log(modelo3D);
			});
		});


		// const objLoader = new THREE.OBJLoader();
		// // objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
		// objLoader.load("../models/porsche911/porche_911.obj", (root) => {
		// 	this.add(root);
		// });

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
			this.animacion = true;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;
				this.animacion = true;

			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'animacion').name('Animacion: ');
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {

		this.children[0].visible = this.guiControls.ver;

		if(this.guiControls.animacion){
			this.children[0].rotation.y += 0.005;
		}
		
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}