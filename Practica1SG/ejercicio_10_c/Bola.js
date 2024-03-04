class Bola extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();
		// Se crea la parte de la interfaz que corresponde a la caja
		// Se crea primero porque otros métodos usan las variables que se definen para la interfaz
		this.createGUI(gui, titleGui);
		this.cambio_size = this.guiControls.size; //Para saber si ha cambiado el tamaño de la ellipse

		// Se crean los materiales
		this.createMaterials();

		this.ellipse = this.crearEllipse();
		this.bola = this.crearBola();
		this.crearTween();

		this.add(this.bola);
		this.add(this.ellipse);
	};

    crearEllipse(){
		var shape = new THREE.Shape();
		
        var radio_y = 10;
		this.radio_x = this.guiControls.size + radio_y;
		
        shape.absellipse(0, 0, this.radio_x, radio_y, 0, Math.PI*2);
        var options = {
			depth: 4,
			steps: 5,
			curveSegments: 20,
			bevelEnabled: true,
			bevelSize: 1,
			bevelSegments: 2,
			bevelThickness: 1,
        };

        var geometry = new THREE.ExtrudeGeometry(shape, options);
        geometry.rotateX(Math.PI * 0.5);
        geometry.translate(0, 5, 0);
		var ellipse = new THREE.Mesh(geometry, this.material_normal_opacity);

		var ellipse_object = new THREE.Object3D();
		ellipse_object.name = "ellipse";
		ellipse_object.add(ellipse)
		
        return ellipse_object;
    };

	crearBola(){
		var geometria = new THREE.SphereBufferGeometry( 3, 32, 32 );
		geometria.translate(this.radio_x, 3, 0);
		var bola = new THREE.Mesh( geometria, this.material_normal);

		return bola;
	};

    crearTween(){
        var origen =  {x : 0};
        var destino = {x : Math.PI * 2};

		var movimiento_girar = new TWEEN.Tween(origen).to(destino, 4000);
		
        var that = this;
        movimiento_girar.onUpdate(function(){
            that.bola.rotation.y = origen.x;
        });
        movimiento_girar.repeat(Infinity);

        var origen2 =  {x :  1};
        var destino2 = {x : -1};
        var movimiento_arrastre = new TWEEN.Tween(origen2).to(destino2, 2000);
        movimiento_arrastre.easing(TWEEN.Easing.Quadratic.InOut);

        movimiento_arrastre.onUpdate(function(){
            that.bola.position.x = origen2.x * that.guiControls.size;
        });

        movimiento_arrastre.yoyo(true);
        movimiento_arrastre.repeat(Infinity);

        movimiento_girar.start();
        movimiento_arrastre.start();
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
			this.size = 0;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.size = 0;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder(titleGui);
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'size', 0, 40, 0.1).name('Extension: ').listen();
		folder.add(this.guiControls, 'reset').name('[ Reset ]');
	};

	update() {
		if(this.guiControls.size != this.cambio_size){ //Esque ha cambiado
			this.remove(this.getObjectByName("ellipse"));
			this.add(this.crearEllipse(this.guiControls.size));
			this.cambio_size = this.guiControls.size;
		}

		TWEEN.update();
		// Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
		// Primero, el escalado
		// Segundo, la rotación en Z
		// Después, la rotación en Y
		// Luego, la rotación en X
		// Y por último la traslación
	};
}