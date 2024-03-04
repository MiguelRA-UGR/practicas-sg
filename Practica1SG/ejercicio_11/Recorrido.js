class Recorrido extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);

		// Se crean los materiales
		this.createMaterials();

		this.cargarModelo();
		this.crearSpline();
		this.crearTween();

		var geometriaLinea = new THREE.Geometry();
		geometriaLinea.vertices = this.spline.getPoints(100);
		var line_spline = new THREE.Line(geometriaLinea, this.lines_material);

		this.add(line_spline);

		// const objLoader = new THREE.OBJLoader();
		// // objLoader.load('https://threejsfundamentals.org/threejs/resources/models/windmill/windmill.obj', (root) => {
		// objLoader.load("../models/porsche911/porche_911.obj", (root) => {
		// 	this.add(root);
		// });

	}

	cargarModelo(){
		this.ironman = new THREE.Object3D();
		var that = this.ironman;
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath("../models/ironMan/");
		mtlLoader.load("IronMan.mtl", function(materials) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials(materials);
			objLoader.setPath("../models/ironMan/");
			objLoader.load("IronMan.obj", function(modelo3D) {
				modelo3D.scale.set(0.035, 0.035, 0.035);
				modelo3D.rotateX(Math.PI*0.5);
				that.add(modelo3D);
			});
		});
		this.add(this.ironman);
	};

	crearSpline(){
		var altura = 15;
        this.spline = new THREE.CatmullRomCurve3([
			new THREE.Vector3(+0, altura, +0),
			new THREE.Vector3(+10, altura, -15),
			new THREE.Vector3(+20, altura, +0),
			new THREE.Vector3(+6, altura, +15),
			new THREE.Vector3(+0, altura, +0),
			new THREE.Vector3(-10, altura, -15),
			new THREE.Vector3(-20, altura, +0),
			new THREE.Vector3(-6, altura, +15),
			new THREE.Vector3(+0, altura, +0)
		]);
	};
	
	crearTween(){
		this.parametro = 0;
		
        var origen = {x: 0};
        var destino = {x: 0.5};
        this.loop1 = 4000;
        this.movimiento = new TWEEN.Tween(origen).to(destino, this.loop1);
        this.movimiento.easing(TWEEN.Easing.Quadratic.InOut);

        var that = this;
        this.movimiento.onUpdate(function () {
            that.parametro = origen.x;
            var posicion = that.spline.getPointAt(that.parametro);
            that.ironman.position.copy(posicion);

            var tangente = that.spline.getTangentAt(that.parametro);
            posicion.add(tangente);
            that.ironman.lookAt(posicion);
        });

        var origen2 = {x : 0.5};
        var destino2 = {x : 1};
        this.loop2 = 8000;
        this.movimiento2 = new TWEEN.Tween(origen2).to(destino2, this.loop2);
        this.movimiento2.easing(TWEEN.Easing.Quadratic.InOut);

        this.movimiento2.onUpdate(function (){
            that.parametro = origen2.x;
            var posicion = that.spline.getPointAt(that.parametro);
            that.ironman.position.copy(posicion);

            var tangente = that.spline.getTangentAt(that.parametro);
            posicion.add(tangente);
            that.ironman.lookAt(posicion);

        });

        this.movimiento.chain(this.movimiento2);
        this.movimiento2.chain(this.movimiento);
        this.movimiento2.start();
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
			linewidth: 1.5,
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
		// this.getObjectByName("ironman").visible = this.guiControls.ver;
		this.ironman.visible = this.guiControls.ver;
		TWEEN.update();
		
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}