import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class Coche extends THREE.Object3D {
    constructor(gui, titleGui) {
        super();

        this.createGUI(gui);

        
    };

	crearMateriales(){
		
	}

	createGUI(gui) {
		this.guiControls = new function () {

		}
	};

	update() {
        
    }
    
} export { Coche };
