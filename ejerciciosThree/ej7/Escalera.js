import * as THREE from '../libs/three.module.js';

import { Tramo } from './Tramo.js'

class Escalera extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui);


		this.tramo1 = new Tramo();
		this.tramo2 = new Tramo();
        this.tramo3 = new Tramo();

        this.tramo1.translateY(1);
		this.tramo1.rotateX(THREE.MathUtils.degToRad(-20));
        this.tramo1.translateY(-1);

        this.tramo2.translateY(1);
        this.tramo2.rotateX(THREE.MathUtils.degToRad(20));
        this.tramo2.translateY(-1);

        
        this.tramo3.translateY(0.1);
        this.tramo3.translateZ(0.1);

        this.tramo1.add(this.tramo3);
		this.add(this.tramo1);
        this.add(this.tramo2);
	};


	createGUI(gui) {
		// Controles para el tamaño, la orientación y la posición de la caja

		this.guiControls = new function () {
			this.ver = true;

			this.desplazamiento_t3 = 0.1;
			this.apertura_escalera = 20;

			// Un botón para dejarlo todo en su posición inicial
			// Cuando se pulse se ejecutará esta función.
			this.reset = function () {
				this.ver = true;

                this.desplazamiento_t3=0.1;
                this.apertura_escalera=20;
			}
		}

		// Se crea una sección para los controles de la caja
		var folder = gui.addFolder("Opciones escalera");
		// Estas lineas son las que añaden los componentes de la interfaz
		// Las tres cifras indican un valor mínimo, un máximo y el incremento
		// El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
		folder.add(this.guiControls, 'ver').name('Ver Objeto: ');
		folder.add(this.guiControls, 'apertura_escalera', 3, 20, 0.1).name('Abrir/Cerrar Escalera: ').listen();
		folder.add(this.guiControls, 'desplazamiento_t3', 0, 1.5, 0.001).name('Extender/Retraer escalera ').listen();

		folder.add(this.guiControls, 'reset').name('[ Reset ]');

	};

	update() {
		this.tramo1.translateY(1);
		this.tramo1.rotation.x = (THREE.MathUtils.degToRad(-this.guiControls.apertura_escalera));
        this.tramo1.translateY(-1);

        this.tramo2.translateY(1);
        this.tramo2.rotation.x = (THREE.MathUtils.degToRad(this.guiControls.apertura_escalera));
        this.tramo2.translateY(-1);

        
        this.tramo3.position.y = (this.guiControls.desplazamiento_t3);
	}
} export { Escalera };
