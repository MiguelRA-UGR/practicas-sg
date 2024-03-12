import * as THREE from '../libs/three.module.js';
import { CSG } from '../libs/CSG-v2.js';

// Definir constantes para tipos de orbes
const TipoOrbe = {
    BUENO: 'bueno',
    MALO: 'malo'
};

class Orbe extends THREE.Object3D {
    constructor(tipo) {
        super();
        this.tipo = tipo;
        
        this.variablesAnimacion = {};
        this.crearMateriales();
    }

    crearMateriales() {
        switch (tipo) {
            case TipoOrbe.BUENO:
                this.color = 0x00ff00;
                this.objetoCaracteristico = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
                break;
            case TipoOrbe.MALO:
                this.color = 0xff0000;
                this.objetoCaracteristico = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
                break;
            default:
                throw new Error('Tipo de orbe no válido');
        }
    }

    update() {
    }
}

export { Orbe, TipoOrbe };
