import * as THREE from '../libs/three.module.js';
import { CSG } from '../libs/CSG-v2.js';

class ObjetoExamen extends THREE.Object3D {
    constructor(tipo) {
        super();
        this.crearMateriales();
    }
    
    update() {

    }

    crearMateriales(){

    }
} export { ObjetoExamen };