class Satelites extends THREE.Object3D {
	constructor(camera) {
		super();
		this.camera = camera;

		//Variables
		this.rad_seg = Math.PI / 180 ;
		this.posicion_satelites = 10; //Cada vez que se añade un satelite a una distancia de 10

		// Se crean los materiales
		this.createMaterials();

		//Crear minutero
		this.tierra = this.crearTierra();
		this.crearSatelite1();
		this.crearSatelite2();
		this.crearSatelite3();

		this.add(this.tierra);
		this.add(this.nodo1);
		this.add(this.nodo2);
		this.add(this.nodo3);
	};

	crearTierra(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		var tierra = new THREE.Mesh( geometria, this.material_tierra);

		tierra.position.set(0, 10, 0);
		tierra.rotateY(-8*Math.PI/12); //Aqui se solventa el problema de ser visto siempre desde Europa

		return tierra;
	};

	crearSatelite1(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		this.satelite1 = new THREE.Mesh( geometria, this.material_satelite);

		//Para que mire siempre hacia la tierra
		this.satelite1.rotateY(Math.PI / 2);

		this.nodo_satelite1 = new THREE.Object3D();
		this.nodo_satelite1.translate(this.posicion_satelites, 0 ,0);
		this.nodo_satelite1.position.set(0, 10, this.posicion_satelites);	
		
		this.nodo_satelite1.add(this.satelite1);

		this.nodo1 = new THREE.Object3D();
		this.nodo1.add(this.nodo_satelite1);

		this.posicion_satelites += 10;
	};

	crearSatelite2(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		this.satelite2 = new THREE.Mesh( geometria, this.material_satelite);
		
		//Para que la cara este al frente
		this.satelite2.rotateY(-Math.PI / 2);

		this.nodo_satelite2 = new THREE.Object3D();
		this.nodo_satelite2.translate(this.posicion_satelites, 0 ,0);
		this.nodo_satelite2.position.set(0, 10, this.posicion_satelites);
		this.nodo_satelite2.lookAt(this.camera.position); //Que mire siempre a la camara, incluso si se mueve
		
		this.nodo_satelite2.add(this.satelite2);

		this.nodo2 = new THREE.Object3D();
		this.nodo2.add(this.nodo_satelite2);

		this.posicion_satelites += 10;
	}

	crearSatelite3(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		this.satelite3 = new THREE.Mesh( geometria, this.material_satelite);
		
		//Para que mire de primeras la cara al frente
		this.satelite3.rotateY(-Math.PI / 2);

		this.nodo_satelite3 = new THREE.Object3D();
		this.nodo_satelite3.translate(this.posicion_satelites, 0 ,0);
		this.nodo_satelite3.position.set(0, 10, this.posicion_satelites);
		
		this.nodo_satelite3.add(this.satelite3);

		this.nodo3 = new THREE.Object3D();
		this.nodo3.add(this.nodo_satelite3);

		this.posicion_satelites += 10;
	};


	createMaterials() {
		// Material de los puntos
		this.points_material = new THREE.PointsMaterial({
			color: 0xda1719,
			size: 0.2,
		});

		var textura_tierra = new THREE.TextureLoader().load('../imgs/tierra.jpg');
		this.material_tierra = new THREE.MeshPhongMaterial({
			map: textura_tierra
		});

		var textura_satelite = new THREE.TextureLoader().load('../imgs/cara.jpg');
		this.material_satelite = new THREE.MeshPhongMaterial({
			map: textura_satelite
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

	rotarTierra(){
		//Hacer rotar un radian por segundo, rotateY en radianes
		this.tierra.rotateY(this.rad_seg);
	};

	rotarSatelite1(){
		this.nodo1.rotateY(this.rad_seg);
	};

	rotarSatelite2(){
		this.nodo_satelite2.lookAt(this.camera.position);
		this.nodo2.rotateY(this.rad_seg);
	};

	rotarSatelite3(){
		this.nodo_satelite3.rotateY(this.rad_seg/(2*Math.PI * 180));
		this.nodo3.rotateY(this.rad_seg);
	};

	update() {
		this.rotarTierra();
		this.rotarSatelite1();
		this.rotarSatelite2();
		this.rotarSatelite3();

		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}