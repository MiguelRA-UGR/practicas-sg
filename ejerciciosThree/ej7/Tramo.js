import * as THREE from '../libs/three.module.js';

class Tramo extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui);

		var sopGeom = new THREE.BoxGeometry (0.1,2,0.1);
		var sopMat = new THREE.MeshNormalMaterial({color: 0xCF0000});
		
		this.soporte1 = new THREE.Mesh (sopGeom, sopMat);
		this.soporte2 = new THREE.Mesh (sopGeom, sopMat);

		this.soporte1.position.set(-0.3,0,0);
		this.soporte2.position.set(0.3,0,0);

		var barGeom = new THREE.BoxGeometry (0.5,0.1,0.1);
		var barMat = new THREE.MeshNormalMaterial({color: 0xCF0000});
		
		this.barra1= new THREE.Mesh (barGeom, barMat);
		this.barra2= new THREE.Mesh (barGeom, barMat);
		this.barra3= new THREE.Mesh (barGeom, barMat);
		this.barra4= new THREE.Mesh (barGeom, barMat);

		this.barra1.position.set(0,0.7,0);
		this.barra2.position.set(0,0.25,0);
		this.barra3.position.set(0,-0.25,0);
		this.barra4.position.set(0,-0.7,0);

		this.Tramo = new THREE.Object3D();
		this.Tramo.add(this.soporte1);
		this.Tramo.add(this.soporte2);

		this.Tramo.add(this.barra1);
		this.Tramo.add(this.barra2);
		this.Tramo.add(this.barra3);
		this.Tramo.add(this.barra4);

		this.add(this.Tramo);
	};

	createGUI(gui) {
		this.guiControls = new function () {
			this.ver = true;

			this.rojo_size = 5;
			this.pen_sup_rotate = 0;

			this.pendulo2_size = 10;
			this.pen_inf_rotate = 0;
			this.posicion = 10;

			this.reset = function () {
				this.ver = true;

				this.rojo_size = 5;
				this.pen_sup_rotate = 0;

				this.pendulo2_size = 10;
				this.pen_inf_rotate = 0;
				this.posicion = 10;
			}
		}
	};

	update() {
		
	}
} export { Tramo };
