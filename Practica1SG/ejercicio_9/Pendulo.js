class Pendulo extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui);

		// Se crean los materiales
		this.createMaterials();

		this.pendulo_sup = this.crearPenduloSup();
		this.pendulo_inf = this.crearPenduloInf();

		this.pendulo_inf.position.z = 1.5; //La suma de las anchuras del p1 y p2, para que pendulo 2 sobresalga
		this.pendulo_inf.position.y = this.pendulo_offset

		this.Pendulo = new THREE.Object3D();
		this.Pendulo.add(this.pendulo_sup);
		this.Pendulo.add(this.pendulo_inf);

		this.add(this.Pendulo);
	};


	crearPenduloSup(){
		this.h = 1.0;
		//Creo el objeto que va a contener las geometrias del pendulo superior
		var pendulo_sup = new THREE.Object3D();

		//Partes OBJECT
		var caja_sup = new THREE.Object3D();
		var caja_media = new THREE.Object3D();

		//Cada figura geometrica sera un Mesh
		var cilindro = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.5, 8), this.material_azul);
		cilindro.rotateX(Math.PI / 2);
		cilindro.position.set(0, 0, 1);

		var parte1 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 2), this.material_verde);

		caja_sup.add(cilindro);
		caja_sup.add(parte1);

		this.parte2 = new THREE.Mesh(new THREE.BoxGeometry(4, this.h, 2), this.material_rojo);
		this.parte2.geometry.translate(0, -this.h/2, 0);
		this.parte2.geometry.scale.y = this.guiControls.rojo_size;
		// this.parte2.position.y = -2;
		caja_media.add(this.parte2);

		this.parte3 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 2), this.material_verde);
		this.parte3.position.y = -2-this.h*this.guiControls.rojo_size; //Le resto dos debido a la mitad altura de la caja superior
		caja_media.add(this.parte3);

		caja_media.position.y = -2;

		pendulo_sup.add(caja_sup);
		pendulo_sup.add(caja_media);
		return pendulo_sup;
	};

	crearPenduloInf(){
		this.pendulo_offset = -2.5 // Bajar desde el origen para que coincida con el comienzo de la parte roja
		var pendulo_inf = new THREE.Object3D();

		var cilindro = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 8), this.material_azul);
		cilindro.rotateX(Math.PI / 2);
		cilindro.position.set(0, -0.5, 0.7);

		this.parte4 = new THREE.Mesh(new THREE.BoxGeometry(1.5, this.h, 1), this.material_naranja);
		this.parte4.geometry.translate(0, -this.h/2, 0);
		this.parte4.geometry.scale.y = this.guiControls.pendulo2_size;
		this.parte4.position.y = this.h/2;

		pendulo_inf.add(cilindro);
		pendulo_inf.add(this.parte4);
		return pendulo_inf;
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

	createGUI(gui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.ver = true;
			this.ver_2 = true;

			//Pendulo superior opciones
			this.rojo_size = 5;
			this.pen_sup_rotate = 0;

			//Pendulo inferior opciones
			this.pendulo2_size = 10
			this.pen_inf_rotate = 0;
			this.posicion = 10;

			//Animacion
			this.animacion_p1 = false;
			this.animacion_p2 = false;
			this.cambio_p1 = false;
			this.cambio_p2 = false;
			this.velocidad_p1 = 0;
			this.velocidad_p2 = 0;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;
				this.ver_2 = true;

				//Pendulo superior opciones
				this.rojo_size = 5;
				this.pen_sup_rotate = 0;

				//Pendulo inferior opciones
				this.pendulo2_size = 10;
				this.pen_inf_rotate = 0;
				this.posicion = 10;

				//Animacion
				this.animacion_p1 = false;
				this.animacion_p2 = false;
				this.cambio_p1 = false;
				this.cambio_p2 = false;
				this.velocidad_p1 = 0;
				this.velocidad_p2 = 0;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder("Pendulo 1");
		var folder2 = gui.addFolder("Pendulo 2");
		var folder3 = gui.addFolder("Animacion");
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'pen_sup_rotate', -Math.PI*0.25, Math.PI*0.25, 0.1).name('Rotar P1: ').listen();
		folder.add(this.guiControls, 'rojo_size', 5, 10, 0.1).name('SizeY P1: ').listen();

		folder2.add(this.guiControls, 'ver_2').name('Ver Objeto: ');
		folder2.add(this.guiControls, 'pen_inf_rotate', -Math.PI*0.25, Math.PI*0.25, 0.1).name('Rotar P2: ').listen();
		folder2.add(this.guiControls, 'pendulo2_size', 10, 20, 0.1).name('SizeY P2: ').listen();
		folder2.add(this.guiControls, 'posicion', 0, 100, 0.1).name('Posicion (%): ').listen();

		folder3.add(this.guiControls, 'animacion_p1').name('Pendulo 1: ');
		folder3.add(this.guiControls, 'velocidad_p1', 0, Math.PI*0.5, 0.1).name('Velocidad (rad/s): ').listen();
		folder3.add(this.guiControls, 'animacion_p2').name('Pendulo 2: ');
		folder3.add(this.guiControls, 'velocidad_p2', 0, Math.PI*0.5, 0.1).name('Velocidad (rad/s): ').listen();

		folder.add(this.guiControls, 'reset').name('[ Reset ]');
		folder2.add(this.guiControls, 'reset').name('[ Reset ]');
		folder3.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		var gui = this.guiControls;

		this.parte2.scale.y = gui.rojo_size;
		this.parte3.position.y = -2 - this.h * gui.rojo_size;

		this.Pendulo.visible = gui.ver;
		this.pendulo_inf.visible = gui.ver_2;

		this.parte4.scale.y = gui.pendulo2_size;
		this.pendulo_inf.position.y = this.pendulo_offset - ((gui.posicion * gui.rojo_size) * 0.01);

		//Animacion P1
		if(gui.animacion_p1){
			if(this.Pendulo.rotation.z >= Math.PI*0.25) gui.cambio_p1 = true;
			if(this.Pendulo.rotation.z <= -Math.PI*0.25) gui.cambio_p1 = false;

			if(gui.cambio_p1){
				this.Pendulo.rotation.z -= gui.velocidad_p1 * 0.05;
			}else{
				this.Pendulo.rotation.z += gui.velocidad_p1 * 0.05;
			}

			gui.pen_sup_rotate = this.Pendulo.rotation.z;
		}else{

			this.Pendulo.rotation.z = gui.pen_sup_rotate;
		}

		if(gui.animacion_p2){
			if(this.pendulo_inf.rotation.z >= Math.PI*0.25) gui.cambio_p2 = true;
			if(this.pendulo_inf.rotation.z <= -Math.PI*0.25) gui.cambio_p2 = false;

			if(gui.cambio_p2){
				this.pendulo_inf.rotation.z -= gui.velocidad_p2 * 0.05;
			}else{
				this.pendulo_inf.rotation.z += gui.velocidad_p2 * 0.05;
			}

			gui.pen_inf_rotate = this.pendulo_inf.rotation.z;
		}else{
			this.pendulo_inf.rotation.z = gui.pen_inf_rotate;
		}

		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}